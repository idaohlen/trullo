export default `#graphql
  directive @auth(role: String, allowSelf: Boolean = false, selfArg: String = "id") on FIELD_DEFINITION
  directive @admin on FIELD_DEFINITION
  directive @self(arg: String = "id") on FIELD_DEFINITION
  directive @owner(field: String = "ownerId", arg: String = "id") on FIELD_DEFINITION
  directive @member(arg: String = "id") on FIELD_DEFINITION
  directive @ownerOrAdmin(arg: String, field: String) on FIELD_DEFINITION
  directive @memberOrAdmin(arg: String, field: String) on FIELD_DEFINITION
`;
