export default `#graphql
  directive @auth(role: String, allowSelf: Boolean = false, selfArg: String = "id") on FIELD_DEFINITION
`;
