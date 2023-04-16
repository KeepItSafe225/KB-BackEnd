# Endpoint: POST /login

## Description
This endpoint is used to authenticate users and generate a JSON Web Token (JWT) for the authenticated user.

## Request Body
- `username` (string, required): the username of the user to be authenticated.
- `password` (string, required): the password of the user to be authenticated.

## Response
- Status code `200`: if the authentication is successful, the response will contain a JWT in the `data` field of the response body.
- Status code `400`: if either the `username` or `password` is missing from the request body, the response will contain a message indicating that the fields are missing.
- Status code `401`: if the provided `password` is incorrect, the response will contain a message indicating that the password is incorrect.
- Status code `404`: if the `username` does not exist in the database, the response will contain a message indicating that the user was not found.

## Example Request

`POST /login`
POST /

Headers:
Content-Type: application/json

Body:
{
  "username": "john_doe",
  "password": "mypassword123"
}

### Response
