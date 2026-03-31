<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Operation;
use App\Entity\User;
use App\Repository\CategoryRepository;
use App\Repository\OperationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Manages financial operation (expense / income) resources for the authenticated user.
 *
 * All routes require authentication. Users can only access and modify
 * their own operations. Operations are always scoped to a category that also
 * belongs to the same user.
 */
#[Route("/api/operations", name: "api_operations_")]
class OperationController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly OperationRepository $operationRepository,
        private readonly CategoryRepository $categoryRepository,
    ) {
        //
    }

    /**
     * Returns all operations belonging to the authenticated user.
     *
     * Supports optional query-string filters:
     * - `category_id` (int)    – filter by category
     * - `from`        (string) – ISO 8601 start date (inclusive), e.g. 2024-01-01
     * - `to`          (string) – ISO 8601 end date   (inclusive), e.g. 2024-12-31
     *
     * @param Request $request The incoming HTTP request
     *
     * @return JsonResponse A list of serialized operation objects.
     */
    #[Route("", name: "index", methods: ["GET"])]
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $qb = $this->operationRepository
            ->createQueryBuilder("o")
            ->andWhere("o.user = :user")
            ->setParameter("user", $user)
            ->orderBy("o.date", "DESC");

        // Optional filter: category
        if ($categoryId = $request->query->getInt("category_id")) {
            $qb->andWhere("o.category = :category")->setParameter(
                "category",
                $categoryId,
            );
        }

        // Optional filter: date range
        if ($from = $request->query->get("from")) {
            try {
                $qb->andWhere("o.date >= :from")->setParameter(
                    "from",
                    new \DateTimeImmutable($from),
                );
            } catch (\Exception) {
                return $this->json(
                    ["error" => 'Invalid "from" date format.'],
                    Response::HTTP_BAD_REQUEST,
                );
            }
        }

        if ($to = $request->query->get("to")) {
            try {
                $qb->andWhere("o.date <= :to")->setParameter(
                    "to",
                    new \DateTimeImmutable($to),
                );
            } catch (\Exception) {
                return $this->json(
                    ["error" => 'Invalid "to" date format.'],
                    Response::HTTP_BAD_REQUEST,
                );
            }
        }

        /** @var Operation[] $operations */
        $operations = $qb->getQuery()->getResult();

        return $this->json(
            array_map(
                fn(Operation $o) => $this->serializeOperation($o),
                $operations,
            ),
        );
    }

    /**
     * Creates a new operation for the authenticated user.
     *
     * Expects a JSON body with the following fields:
     * - `label`       (string)  – human-readable description
     * - `amount`      (float)   – positive or negative monetary value
     * - `date`        (string)  – ISO 8601 date, e.g. "2024-06-15"
     * - `category_id` (int)     – ID of a category owned by the authenticated user
     *
     * Returns 201 on success, 400 on missing/invalid fields, 404 if the
     * category does not belong to the user.
     *
     * @param Request $request The incoming HTTP request
     *
     * @return JsonResponse
     */
    #[Route("", name: "create", methods: ["POST"])]
    public function create(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);

        $validationError = $this->validateOperationPayload($data);
        if ($validationError !== null) {
            return $this->json(
                ["error" => $validationError],
                Response::HTTP_BAD_REQUEST,
            );
        }

        $category = $this->findOwnedCategoryOr404(
            (int) $data["category_id"],
            $user,
        );

        try {
            $date = new \DateTimeImmutable($data["date"]);
        } catch (\Exception) {
            return $this->json(
                [
                    "error" =>
                        "Invalid date format. Expected ISO 8601, e.g. 2024-06-15.",
                ],
                Response::HTTP_BAD_REQUEST,
            );
        }

        $operation = new Operation();
        $operation->setLabel($data["label"]);
        $operation->setAmount((float) $data["amount"]);
        $operation->setDate($date);
        $operation->setCategory($category);
        $operation->setUser($user);

        $this->entityManager->persist($operation);
        $this->entityManager->flush();

        return $this->json(
            $this->serializeOperation($operation),
            Response::HTTP_CREATED,
        );
    }

    /**
     * Returns a summary of the authenticated user's operations.
     *
     * The response includes:
     * - `total_income`  – sum of all positive amounts
     * - `total_expense` – sum of all negative amounts
     * - `balance`       – net balance (income + expenses)
     * - `count`         – total number of operations
     *
     * Declared before /{id} routes to prevent Symfony from matching the
     * literal string "summary" as an integer ID parameter.
     *
     * @return JsonResponse
     */
    #[Route("/summary", name: "summary", methods: ["GET"])]
    public function summary(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $result = $this->operationRepository
            ->createQueryBuilder("o")
            ->select(
                "SUM(CASE WHEN o.amount > 0 THEN o.amount ELSE 0 END) AS total_income",
                "SUM(CASE WHEN o.amount < 0 THEN o.amount ELSE 0 END) AS total_expense",
                "SUM(o.amount) AS balance",
                "COUNT(o.id)   AS count",
            )
            ->andWhere("o.user = :user")
            ->setParameter("user", $user)
            ->getQuery()
            ->getSingleResult();

        return $this->json([
            "total_income" => round((float) $result["total_income"], 2),
            "total_expense" => round((float) $result["total_expense"], 2),
            "balance" => round((float) $result["balance"], 2),
            "count" => (int) $result["count"],
        ]);
    }

    /**
     * Returns a single operation by its ID.
     *
     * Returns 404 if the operation does not exist or does not belong to the
     * authenticated user.
     *
     * @param int $id The operation ID
     *
     * @return JsonResponse
     */
    #[
        Route(
            "/{id}",
            name: "show",
            methods: ["GET"],
            requirements: ["id" => "\d+"],
        ),
    ]
    public function show(int $id): JsonResponse
    {
        $operation = $this->findOwnedOperationOr404($id);

        return $this->json($this->serializeOperation($operation));
    }

    /**
     * Fully or partially updates an existing operation.
     *
     * All fields are optional for PATCH requests; omitted fields retain their
     * current values. For PUT requests all fields should be supplied.
     *
     * Updatable fields: `label`, `amount`, `date`, `category_id`.
     *
     * Returns 404 if the operation or the target category does not belong to the user.
     * Returns 400 on invalid field values.
     *
     * @param Request $request The incoming HTTP request
     * @param int     $id      The operation ID
     *
     * @return JsonResponse
     */
    #[
        Route(
            "/{id}",
            name: "update",
            methods: ["PUT", "PATCH"],
            requirements: ["id" => "\d+"],
        ),
    ]
    public function update(Request $request, int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $operation = $this->findOwnedOperationOr404($id);

        $data = json_decode($request->getContent(), true);

        if (isset($data["label"])) {
            $operation->setLabel($data["label"]);
        }

        if (isset($data["amount"])) {
            $operation->setAmount((float) $data["amount"]);
        }

        if (isset($data["date"])) {
            try {
                $operation->setDate(new \DateTimeImmutable($data["date"]));
            } catch (\Exception) {
                return $this->json(
                    [
                        "error" =>
                            "Invalid date format. Expected ISO 8601, e.g. 2024-06-15.",
                    ],
                    Response::HTTP_BAD_REQUEST,
                );
            }
        }

        if (isset($data["category_id"])) {
            $category = $this->findOwnedCategoryOr404(
                (int) $data["category_id"],
                $user,
            );
            $operation->setCategory($category);
        }

        $this->entityManager->flush();

        return $this->json($this->serializeOperation($operation));
    }

    /**
     * Deletes an operation owned by the authenticated user.
     *
     * Returns 404 if the operation does not exist or does not belong to the user.
     * Returns 204 No Content on success.
     *
     * @param int $id The operation ID
     *
     * @return JsonResponse
     */
    #[
        Route(
            "/{id}",
            name: "delete",
            methods: ["DELETE"],
            requirements: ["id" => "\d+"],
        ),
    ]
    public function delete(int $id): JsonResponse
    {
        $operation = $this->findOwnedOperationOr404($id);

        $this->entityManager->remove($operation);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Validates the required fields of an operation creation payload.
     *
     * @param mixed $data Decoded JSON payload
     *
     * @return string|null An error message, or null when the payload is valid
     */
    private function validateOperationPayload(mixed $data): ?string
    {
        if (!is_array($data)) {
            return "Invalid JSON body.";
        }

        if (empty($data["label"])) {
            return "Label is required.";
        }

        if (!isset($data["amount"]) || !is_numeric($data["amount"])) {
            return "A numeric amount is required.";
        }

        if (empty($data["date"])) {
            return "Date is required.";
        }

        if (empty($data["category_id"]) || !is_numeric($data["category_id"])) {
            return "A valid category_id is required.";
        }

        return null;
    }

    /**
     * Finds an operation by ID that belongs to the authenticated user.
     *
     * @param int $id The operation ID to look up
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     *
     * @return Operation
     */
    private function findOwnedOperationOr404(int $id): Operation
    {
        /** @var User $user */
        $user = $this->getUser();

        $operation = $this->operationRepository->findOneBy([
            "id" => $id,
            "user" => $user,
        ]);

        if ($operation === null) {
            throw $this->createNotFoundException(
                sprintf("Operation %d not found.", $id),
            );
        }

        return $operation;
    }

    /**
     * Finds a category by ID that belongs to the given user.
     *
     * @param int  $id   The category ID to look up
     * @param User $user The owner to match against
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     *
     * @return Category
     */
    private function findOwnedCategoryOr404(int $id, User $user): Category
    {
        $category = $this->categoryRepository->findOneBy([
            "id" => $id,
            "user" => $user,
        ]);

        if ($category === null) {
            throw $this->createNotFoundException(
                sprintf("Category %d not found.", $id),
            );
        }

        return $category;
    }

    /**
     * Serializes an Operation entity into a plain array for JSON output.
     *
     * @param Operation $operation The operation to serialize
     *
     * @return array{
     *   id: int|null,
     *   label: string|null,
     *   amount: float|null,
     *   date: string,
     *   category: array{id: int|null, title: string|null}
     * }
     */
    private function serializeOperation(Operation $operation): array
    {
        return [
            "id" => $operation->getId(),
            "label" => $operation->getLabel(),
            "amount" => $operation->getAmount(),
            "date" => $operation->getDate()?->format("Y-m-d"),
            "category" => [
                "id" => $operation->getCategory()?->getId(),
                "title" => $operation->getCategory()?->getTitle(),
            ],
        ];
    }
}
