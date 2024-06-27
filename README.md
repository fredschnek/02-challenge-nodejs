# Daily Diet API

## About the Challenge

In this challenge, we developed an API to manage daily diet tracking. The API includes the following functionalities:

- Creating a user
- Identifying a user between requests
- Registering a meal with specific details
- Editing a meal
- Deleting a meal
- Listing all meals of a user
- Viewing a single meal
- Retrieving user metrics

## Functional Implementation

### Meal Structure
A meal has the following properties:
- `id` - Unique identifier for each meal
- `name` - Name of the meal
- `description` - Detailed description of the meal
- `date` - Date and time when the meal was consumed
- `is_on_diet` - Boolean indicating whether the meal is within the diet
- `user_id` - Identifier for the user to whom the meal belongs

### Routes and Business Rules

#### `POST - /users`
- Creates a new user in the database.
- The `name` and `email` fields are sent in the body of the request.
- If a user with the provided email already exists, a 400 status with an appropriate error message is returned.
- A session ID cookie is set if it does not already exist.

#### `POST - /meals`
- Registers a new meal in the database.
- The `name`, `description`, `is_on_diet`, and `date` fields are sent in the body of the request.
- The `id`, `user_id`, and timestamp fields are automatically filled as per the property guidelines.
- The request includes a valid session ID.

#### `GET - /meals`
- Lists all meals of a user.
- The meals are ordered by date in descending order.
- The request includes a valid session ID.

#### `GET - /meals/:mealId`
- Views a single meal by `id`.
- Returns meal details including `name`, `description`, `date`, and `is_on_diet`.
- Validates if the `id` belongs to a meal saved in the database before returning the data.
- The request includes a valid session ID.

#### `PUT - /meals/:mealId`
- Updates a meal by `id`.
- The body of the request contains `name`, `description`, `is_on_diet`, and/or `date`.
- Validates if the `id` belongs to a meal saved in the database before updating.
- The request includes a valid session ID.

#### `DELETE - /meals/:mealId`
- Removes a meal by `id`.
- Validates if the `id` belongs to a meal saved in the database before deleting.
- The request includes a valid session ID.

#### `GET - /metrics`
- Retrieves metrics for a user.
- Returns:
  - Total number of meals registered
  - Total number of meals within the diet
  - Total number of meals outside the diet
  - Best sequence of meals within the diet
- The request includes a valid session ID.

## Non-Functional Implementation

### Performance
- The API is capable of handling a large number of simultaneous requests efficiently.

### Security
- Input validation is rigorous to prevent common vulnerabilities.
- Proper authentication and authorization mechanisms are implemented to ensure that users can only access their own data.

### Maintainability
- The code is modular and follows good programming practices, facilitating maintenance and future expansion.
- Clear documentation is provided on how to use the API, including request and response examples.

### Reliability
- The API has high availability and is resilient to failures.
- Appropriate logging is implemented to monitor and diagnose issues.

### Usability
- The API is simple and intuitive for developers to use.
- API responses are clear and consistent.

### Compatibility
- The API is compatible with current versions of major browsers and HTTP client tools.
- It is easy to integrate the API with other applications and services.

## Conclusion

The Daily Diet API provides an efficient and secure way to manage daily diet tracking, including user creation, meal management, and metrics retrieval. By following the described functional and non-functional implementations, the API offers a robust and reliable experience for users.