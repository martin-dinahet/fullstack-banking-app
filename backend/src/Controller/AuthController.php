<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

/**
 * Handles user authentication-related actions such as registration.
 *
 * Login is handled by Symfony's security firewall (e.g. LexikJWTAuthenticationBundle).
 */
#[Route("/api", name: "api_auth_")]
class AuthController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
        //
    }

    /**
     * Login endpoint handled entirely by the json_login firewall.
     *
     * This method body is never executed on success — the LexikJWT success handler
     * intercepts the request first and returns the token. The route must exist
     * so Symfony's router does not 404 before the firewall runs.
     *
     * @param User|null $user Injected by Symfony after successful authentication
     *
     * @return JsonResponse
     */
    #[Route("/login", name: "login", methods: ["POST"])]
    public function login(#[CurrentUser] ?User $user): JsonResponse
    {
        if ($user === null) {
            return $this->json(
                ["error" => "Invalid credentials."],
                Response::HTTP_UNAUTHORIZED,
            );
        }

        // Never reached on success — LexikJWT handler returns the token response.
        return $this->json(["user" => $user->getId()]);
    }

    /**
     * Registers a new user account.
     *
     * Expects a JSON body with `email` and `password` fields.
     * Returns 201 on success, 400 on validation failure, 409 if email is already taken.
     *
     * @param Request $request The incoming HTTP request
     *
     * @return JsonResponse
     */
    #[Route("/register", name: "register", methods: ["POST"])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data["email"]) || empty($data["password"])) {
            return $this->json(
                ["error" => "Email and password are required."],
                Response::HTTP_BAD_REQUEST,
            );
        }

        $existingUser = $this->entityManager
            ->getRepository(User::class)
            ->findOneBy(["email" => $data["email"]]);

        if ($existingUser !== null) {
            return $this->json(
                ["error" => "This email address is already in use."],
                Response::HTTP_CONFLICT,
            );
        }

        $user = new User();
        $user->setEmail($data["email"]);
        $user->setPassword(
            $this->passwordHasher->hashPassword($user, $data["password"]),
        );
        $user->setRoles(["ROLE_USER"]);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->json(
            [
                "message" => "User registered successfully.",
                "id" => $user->getId(),
            ],
            Response::HTTP_CREATED,
        );
    }

    /**
     * Returns the profile of the currently authenticated user.
     *
     * This route is protected by the security firewall.
     *
     * @return JsonResponse
     */
    #[Route("/me", name: "me", methods: ["GET"])]
    public function me(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        return $this->json([
            "id" => $user->getId(),
            "email" => $user->getEmail(),
            "roles" => $user->getRoles(),
        ]);
    }

    /**
     * Logs the user out.
     *
     * @return JsonResponse
     */
    #[Route("/logout", name: "logout", methods: ["POST"])]
    public function logout(): JsonResponse
    {
        $cookie = Cookie::create("jwt")
            ->withValue("")
            ->withExpires(new \DateTime("@0"))
            ->withPath("/")
            ->withSecure(false)
            ->withHttpOnly(true)
            ->withSameSite("strict");

        $response = new JsonResponse(null, Response::HTTP_NO_CONTENT);
        $response->headers->setCookie($cookie);

        return $response;
    }
}
