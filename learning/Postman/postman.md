# Postman Collection for Educational Platform API

This document outlines the collection of API requests for the Educational Platform.

## Base URL

The base URL for all requests is `http://localhost:3000/api`.

---

## 1. Authentication (`/auth`)

### 1.1. Register a new user

*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/auth/register`
*   **Description:** Creates a new user account and returns an access token.
*   **Body:** `raw` (JSON)

    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "name": "Test User"
    }
    ```

### 1.2. Login an existing user

*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/auth/login`
*   **Description:** Authenticates a user and returns an access token.
*   **Body:** `raw` (JSON)

    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```

### 1.3. Refresh access token

*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/auth/refresh`
*   **Description:** Generates a new access token using the refresh token stored in cookies. No body is required. The refresh token is sent automatically by the client (e.g., browser or Postman) if it was received from the login/register response.

### 1.4. Logout user

*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/auth/logout`
*   **Description:** Clears the authentication cookies.

---

## 2. Users (`/users`)

Requires `Authorization` header with `Bearer <accessToken>`.

### 2.1. Get current user profile

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/users/@me`
*   **Description:** Retrieves the profile of the currently authenticated user.
*   **Auth:** Bearer Token.

### 2.2. Update current user profile

*   **Method:** `PATCH`
*   **URL:** `{{baseUrl}}/users/@me`
*   **Description:** Updates the profile of the currently authenticated user.
*   **Auth:** Bearer Token.
*   **Body:** `raw` (JSON)

    ```json
    {
      "name": "New Name",
      "email": "new-email@example.com"
    }
    ```

### 2.3. Get all users (Admin only)

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/users`
*   **Description:** Retrieves a list of all users. Requires admin privileges.
*   **Auth:** Bearer Token (from an admin user).

### 2.4. Create a new user (Admin only)

*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/users`
*   **Description:** Creates a new user. Requires admin privileges.
*   **Auth:** Bearer Token (from an admin user).
*   **Body:** `raw` (JSON)

    ```json
    {
      "email": "newuser@example.com",
      "password": "password123",
      "name": "New User",
      "role": "USER"
    }
    ```

### 2.5. Update a user (Admin only)

*   **Method:** `PATCH`
*   **URL:** `{{baseUrl}}/users/:id`
*   **Description:** Updates a user by their ID. Requires admin privileges.
*   **Auth:** Bearer Token (from an admin user).
*   **Path Variables:**
    *   `id`: The ID of the user to update.
*   **Body:** `raw` (JSON)

    ```json
    {
      "name": "Updated Name",
      "role": "ADMIN"
    }
    ```

---

## 3. Subjects (`/subjects`)

### 3.1. Get all subjects

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/subjects`
*   **Description:** Retrieves a list of all subjects.

### 3.2. Get a single subject

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/subjects/:id`
*   **Description:** Retrieves a single subject by its ID.
*   **Path Variables:**
    *   `id`: The ID of the subject to retrieve.

### 3.3. Create a new subject (Admin/Moderator only)

*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/subjects`
*   **Description:** Creates a new subject. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Body:** `raw` (JSON)

    ```json
    {
      "name": "New Subject Name",
      "description": "A description for the new subject."
    }
    ```

### 3.4. Update a subject (Admin/Moderator only)

*   **Method:** `PATCH`
*   **URL:** `{{baseUrl}}/subjects/:id`
*   **Description:** Updates a subject by its ID. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Path Variables:**
    *   `id`: The ID of the subject to update.
*   **Body:** `raw` (JSON)

    ```json
    {
      "name": "Updated Subject Name"
    }
    ```

### 3.5. Delete a subject (Admin/Moderator only)

*   **Method:** `DELETE`
*   **URL:** `{{baseUrl}}/subjects/:id`
*   **Description:** Deletes a subject by its ID. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Path Variables:**
    *   `id`: The ID of the subject to delete.

---

## 4. Topics (`/topics`)

### 4.1. Get all topics

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/topics`
*   **Description:** Retrieves a list of all topics.

### 4.2. Get a single topic

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/topics/:id`
*   **Description:** Retrieves a single topic by its ID.
*   **Path Variables:**
    *   `id`: The ID of the topic to retrieve.

### 4.3. Create a new topic (Admin/Moderator only)

*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/topics`
*   **Description:** Creates a new topic. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Body:** `raw` (JSON)

    ```json
    {
      "name": "New Topic Name",
      "subjectId": "subject-id-goes-here"
    }
    ```

### 4.4. Update a topic (Admin/Moderator only)

*   **Method:** `PATCH`
*   **URL:** `{{baseUrl}}/topics/:id`
*   **Description:** Updates a topic by its ID. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Path Variables:**
    *   `id`: The ID of the topic to update.
*   **Body:** `raw` (JSON)

    ```json
    {
      "name": "Updated Topic Name"
    }
    ```

### 4.5. Delete a topic (Admin/Moderator only)

*   **Method:** `DELETE`
*   **URL:** `{{baseUrl}}/topics/:id`
*   **Description:** Deletes a topic by its ID. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Path Variables:**
    *   `id`: The ID of the topic to delete.

---

## 5. Lessons (`/lessons`)

### 5.1. Get all lessons

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/lessons`
*   **Description:** Retrieves a list of all lessons.

### 5.2. Get a single lesson

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/lessons/:id`
*   **Description:** Retrieves a single lesson by its ID.
*   **Path Variables:**
    *   `id`: The ID of the lesson to retrieve.

### 5.3. Create a new lesson (Admin/Moderator only)

*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/lessons`
*   **Description:** Creates a new lesson. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Body:** `raw` (JSON)

    ```json
    {
      "title": "New Lesson Title",
      "content": "Content of the lesson.",
      "topicId": "topic-id-goes-here"
    }
    ```

### 5.4. Update a lesson (Admin/Moderator only)

*   **Method:** `PATCH`
*   **URL:** `{{baseUrl}}/lessons/:id`
*   **Description:** Updates a lesson by its ID. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Path Variables:**
    *   `id`: The ID of the lesson to update.
*   **Body:** `raw` (JSON)

    ```json
    {
      "title": "Updated Lesson Title"
    }
    ```

### 5.5. Delete a lesson (Admin/Moderator only)

*   **Method:** `DELETE`
*   **URL:** `{{baseUrl}}/lessons/:id`
*   **Description:** Deletes a lesson by its ID. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Path Variables:**
    *   `id`: The ID of the lesson to delete.

---

## 6. Quizzes (`/quizzes`)

### 6.1. Get all quizzes

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/quizzes`
*   **Description:** Retrieves a list of all quizzes.
*   **Auth:** Bearer Token.

### 6.2. Get a single quiz

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/quizzes/:id`
*   **Description:** Retrieves a single quiz by its ID.
*   **Auth:** Bearer Token.
*   **Path Variables:**
    *   `id`: The ID of the quiz to retrieve.

### 6.3. Create a new quiz (Admin/Moderator only)

*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/quizzes`
*   **Description:** Creates a new quiz. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Body:** `raw` (JSON)

    ```json
    {
      "title": "New Quiz Title",
      "topicId": "topic-id-goes-here",
      "questions": [
        {
          "text": "What is 2+2?",
          "answers": [
            { "text": "3", "isCorrect": false },
            { "text": "4", "isCorrect": true }
          ]
        }
      ]
    }
    ```

### 6.4. Update a quiz (Admin/Moderator only)

*   **Method:** `PATCH`
*   **URL:** `{{baseUrl}}/quizzes/:id`
*   **Description:** Updates a quiz by its ID. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Path Variables:**
    *   `id`: The ID of the quiz to update.
*   **Body:** `raw` (JSON)

    ```json
    {
      "title": "Updated Quiz Title"
    }
    ```

### 6.5. Delete a quiz (Admin/Moderator only)

*   **Method:** `DELETE`
*   **URL:** `{{baseUrl}}/quizzes/:id`
*   **Description:** Deletes a quiz by its ID. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Path Variables:**
    *   `id`: The ID of the quiz to delete.

### 6.6. Submit a quiz

*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/quizzes/:id/submit`
*   **Description:** Submits a user's answers for a quiz and returns the result.
*   **Auth:** Bearer Token.
*   **Path Variables:**
    *   `id`: The ID of the quiz to submit.
*   **Body:** `raw` (JSON)

    ```json
    {
      "answers": [
        {
          "questionId": "question-id-goes-here",
          "answerId": "answer-id-goes-here"
        }
      ]
    }
    ```

---

## 7. Progress (`/progress`)

All endpoints require `Authorization` header with `Bearer <accessToken>`.

### 7.1. Get all progress for current user

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/progress`
*   **Description:** Retrieves all progress records for the currently authenticated user.
*   **Auth:** Bearer Token.

### 7.2. Get progress for a specific lesson

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/progress/:lessonId`
*   **Description:** Retrieves the progress for a specific lesson for the currently authenticated user.
*   **Auth:** Bearer Token.
*   **Path Variables:**
    *   `lessonId`: The ID of the lesson.

### 7.3. Create a new progress record (Admin/Moderator only)

*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/progress`
*   **Description:** Creates a new progress record. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Body:** `raw` (JSON)

    ```json
    {
      "lessonId": "lesson-id-goes-here",
      "completed": true
    }
    ```

### 7.4. Update a progress record (Admin/Moderator only)

*   **Method:** `PATCH`
*   **URL:** `{{baseUrl}}/progress/:lessonId`
*   **Description:** Updates a progress record. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Path Variables:**
    *   `lessonId`: The ID of the lesson.
*   **Body:** `raw` (JSON)

    ```json
    {
      "completed": false
    }
    ```

### 7.5. Delete a progress record (Admin/Moderator only)

*   **Method:** `DELETE`
*   **URL:** `{{baseUrl}}/progress/:lessonId`
*   **Description:** Deletes a progress record. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Path Variables:**
    *   `lessonId`: The ID of the lesson.

---

## 8. Certificates (`/certificates`)

All endpoints require `Authorization` header with `Bearer <accessToken>`.

### 8.1. Get all certificates (Admin only)

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/certificates`
*   **Description:** Retrieves a list of all certificates. Requires admin privileges.
*   **Auth:** Bearer Token (from an admin user).

### 8.2. Get certificates for a specific user

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/certificates/user/:userId`
*   **Description:** Retrieves all certificates for a specific user. Can be accessed by the user themselves or an admin.
*   **Auth:** Bearer Token.
*   **Path Variables:**
    *   `userId`: The ID of the user.

### 8.3. Get a single certificate

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/certificates/:id`
*   **Description:** Retrieves a single certificate by its ID. The user must be the owner of the certificate or an admin.
*   **Auth:** Bearer Token.
*   **Path Variables:**
    *   `id`: The ID of the certificate to retrieve.

### 8.4. Create a new certificate (Admin/Moderator only)

*   **Method:** `POST`
*   **URL:** `{{baseUrl}}/certificates`
*   **Description:** Creates a new certificate for a user upon successful completion of a subject. Requires admin or moderator privileges.
*   **Auth:** Bearer Token (from an admin or moderator user).
*   **Body:** `raw` (JSON)

    ```json
    {
      "userId": "user-id-goes-here",
      "subjectId": "subject-id-goes-here"
    }
    ```

### 8.5. Download Certificate PDF

*   **Method:** `GET`
*   **URL:** `{{baseUrl}}/certificates/:id/download`
*   **Description:** Generates and downloads a PDF certificate for the given ID. Can be accessed by the certificate owner or an admin.
*   **Auth:** Bearer Token.
*   **Path Variables:**
    *   `id`: The ID of the certificate to download.
*   **Usage in Postman:** Use the "Send and Download" option to save the response as a PDF file.

---

## 9. Testing Certificate Generation

This section describes the end-to-end flow for testing certificate generation.

### Prerequisites

Before you begin, ensure you have the following data in your system:
1.  A user with the `ADMIN` or `MODERATOR` role.
2.  A user with the `STUDENT` role.
3.  A `Subject` with at least one `Lesson`.
4.  **Completed Progress**: The `STUDENT` must have completed all lessons within the `Subject`. This means a `UserProgress` record must exist for each lesson, linking the student to the lesson, with `isCompleted` set to `true`.

**Note on Creating Progress**: The `POST /progress` endpoint is restricted and marks progress for the authenticated user (the admin/moderator). To test for a specific student, you may need to either:
a) Temporarily modify the endpoint to accept a `userId` in the body.
b) Manually insert the `UserProgress` records into the database.

### Step 1: Mark Lessons as Completed (as Admin/Moderator)

1.  **Authenticate** as an Admin or Moderator by sending a `POST` request to `/auth/login` and get the `accessToken`.
2.  For **each lesson** in the subject, send a `POST` request to `{{baseUrl}}/progress`.
3.  **Header**: `Authorization: Bearer <your_admin_token>`
4.  **Body**:
    ```json
    {
      "lessonId": "the-lesson-id",
      "completed": true
    }
    ```
    *(Remember the limitation mentioned above regarding `userId`)*

### Step 2: Create the Certificate Record (as Admin/Moderator)

Once all lessons are marked as complete for the student, you can create the certificate record.

1.  **Request**: `POST {{baseUrl}}/certificates`
2.  **Header**: `Authorization: Bearer <your_admin_token>`
3.  **Body**:
    ```json
    {
      "userId": "student-user-id",
      "subjectId": "the-subject-id"
    }
    ```
4.  **Response**: If successful, the API will return the certificate object. Copy the `id` from this response.

### Step 3: Download the Certificate PDF

Finally, download the generated PDF to verify its contents.

1.  **Request**: `GET {{baseUrl}}/certificates/<certificate_id>/download` (replace `<certificate_id>` with the ID from Step 2).
2.  **Header**: `Authorization: Bearer <student_token_or_admin_token>` (can be downloaded by either the student or an admin).
3.  **Action in Postman**: Click the arrow next to the "Send" button and choose **"Send and Download"**.
4.  **Verify**: Postman will prompt you to save the file. Save it, then open the PDF to confirm that the student's name, subject title, and issue date are correct.
