const Permisions = [{PermisionName:'Create Posts'},{PermisionName:'Watch Posts'},{PermisionName:'Delete Posts'}]
const Roles = [{RoleName: 'Admin',RolePermisions:[1,2,3]},{RoleName: 'RegularUser',RolePermisions:[2]}]
const Users = [{username: 'Amir@gmail.com',password:'admin',Roles:[1]},{username: 'user@gmail.com',password:'123',Roles:[2]}]

export default {Permisions,Roles,Users}