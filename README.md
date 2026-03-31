# List of all operations
```sh
# Export the token from the login response
export TOKEN="eyJ..."

# 1. Get current user
curlie GET localhost:8080/api/me \
  Authorization:"Bearer $TOKEN"

# 2. Create categories
curlie POST localhost:8080/api/categories \
  Content-Type:application/json \
  Authorization:"Bearer $TOKEN" \
  title="Food"

curlie POST localhost:8080/api/categories \
  Content-Type:application/json \
  Authorization:"Bearer $TOKEN" \
  title="Transport"

# 3. List categories
curlie GET localhost:8080/api/categories \
  Authorization:"Bearer $TOKEN"

# 4. Get single category
curlie GET localhost:8080/api/categories/1 \
  Authorization:"Bearer $TOKEN"

# 5. Update a category
curlie PATCH localhost:8080/api/categories/1 \
  Content-Type:application/json \
  Authorization:"Bearer $TOKEN" \
  title="Groceries"

# 6. Create operations
curlie POST localhost:8080/api/operations \
  Content-Type:application/json \
  Authorization:"Bearer $TOKEN" \
  label="Weekly groceries" \
  amount:=-45.50 \
  date="2024-03-15" \
  category_id:=1

curlie POST localhost:8080/api/operations \
  Content-Type:application/json \
  Authorization:"Bearer $TOKEN" \
  label="Salary" \
  amount:=2500.00 \
  date="2024-03-01" \
  category_id:=1

curlie POST localhost:8080/api/operations \
  Content-Type:application/json \
  Authorization:"Bearer $TOKEN" \
  label="Metro pass" \
  amount:=-35.00 \
  date="2024-03-10" \
  category_id:=1

# 7. List operations
curlie GET localhost:8080/api/operations \
  Authorization:"Bearer $TOKEN"

# 8. Filter by category
curlie GET "localhost:8080/api/operations?category_id=1" \
  Authorization:"Bearer $TOKEN"

# 9. Filter by date range
curlie GET "localhost:8080/api/operations?from=2024-03-01&to=2024-03-31" \
  Authorization:"Bearer $TOKEN"

# 10. Get single operation
curlie GET localhost:8080/api/operations/1 \
  Authorization:"Bearer $TOKEN"

# 11. Update an operation
curlie PATCH localhost:8080/api/operations/1 \
  Content-Type:application/json \
  Authorization:"Bearer $TOKEN" \
  label="Monthly groceries" \
  amount:=-120.00

# 12. Get summary
curlie GET localhost:8080/api/operations/summary \
  Authorization:"Bearer $TOKEN"

# 13. Delete an operation
curlie DELETE localhost:8080/api/operations/3 \
  Authorization:"Bearer $TOKEN"

# 14. Delete a category
curlie DELETE localhost:8080/api/categories/2 \
  Authorization:"Bearer $TOKEN"
```
