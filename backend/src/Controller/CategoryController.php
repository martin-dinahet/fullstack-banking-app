<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\User;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Manages category resources for the authenticated user.
 *
 * All routes require authentication. Users can only access and modify
 * their own categories.
 */
#[Route("/api/categories", name: "api_categories_")]
class CategoryController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly CategoryRepository $categoryRepository,
    ) {
        //
    }

    /**
     * Returns all categories belonging to the authenticated user.
     *
     * @return JsonResponse A list of category objects with their IDs and titles.
     */
    #[Route("", name: "index", methods: ["GET"])]
    public function index(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $categories = $this->categoryRepository->findBy(["user" => $user]);

        $data = array_map(
            fn(Category $c) => $this->serializeCategory($c),
            $categories,
        );

        return $this->json($data);
    }

    /**
     * Creates a new category for the authenticated user.
     *
     * Expects a JSON body with a `title` field.
     * Returns 201 on success, 400 if the title is missing.
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

        if (empty($data["title"])) {
            return $this->json(
                ["error" => "Title is required."],
                Response::HTTP_BAD_REQUEST,
            );
        }

        $category = new Category();
        $category->setTitle($data["title"]);
        $category->setUser($user);

        $this->entityManager->persist($category);
        $this->entityManager->flush();

        return $this->json(
            $this->serializeCategory($category),
            Response::HTTP_CREATED,
        );
    }

    /**
     * Returns a single category by its ID.
     *
     * Returns 404 if the category does not exist or does not belong to the
     * authenticated user.
     *
     * @param int $id The category ID
     *
     * @return JsonResponse
     */
    #[Route("/{id}", name: "show", methods: ["GET"])]
    public function show(int $id): JsonResponse
    {
        $category = $this->findOwnedCategoryOr404($id);

        return $this->json($this->serializeCategory($category));
    }

    /**
     * Updates the title of an existing category.
     *
     * Expects a JSON body with a `title` field.
     * Returns 404 if the category does not exist or does not belong to the user.
     * Returns 400 if the title is missing.
     *
     * @param Request $request The incoming HTTP request
     * @param int     $id      The category ID
     *
     * @return JsonResponse
     */
    #[Route("/{id}", name: "update", methods: ["PUT", "PATCH"])]
    public function update(Request $request, int $id): JsonResponse
    {
        $category = $this->findOwnedCategoryOr404($id);

        $data = json_decode($request->getContent(), true);

        if (empty($data["title"])) {
            return $this->json(
                ["error" => "Title is required."],
                Response::HTTP_BAD_REQUEST,
            );
        }

        $category->setTitle($data["title"]);
        $this->entityManager->flush();

        return $this->json($this->serializeCategory($category));
    }

    /**
     * Deletes a category owned by the authenticated user.
     *
     * Returns 404 if the category does not exist or does not belong to the user.
     * Returns 204 No Content on success.
     *
     * @param int $id The category ID
     *
     * @return JsonResponse
     */
    #[Route("/{id}", name: "delete", methods: ["DELETE"])]
    public function delete(int $id): JsonResponse
    {
        $category = $this->findOwnedCategoryOr404($id);

        $this->entityManager->remove($category);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Finds a category by ID that belongs to the authenticated user.
     *
     * Throws a 404 HTTP exception if the category is not found or is owned
     * by a different user.
     *
     * @param int $id The category ID to look up
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     *
     * @return Category
     */
    private function findOwnedCategoryOr404(int $id): Category
    {
        /** @var User $user */
        $user = $this->getUser();

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
     * Serializes a Category entity into a plain array for JSON output.
     *
     * @param Category $category The category to serialize
     *
     * @return array{id: int|null, title: string|null, operationCount: int}
     */
    private function serializeCategory(Category $category): array
    {
        return [
            "id" => $category->getId(),
            "title" => $category->getTitle(),
            "operationCount" => $category->getOperations()->count(),
        ];
    }
}
