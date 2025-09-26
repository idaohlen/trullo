import { authDirectiveTransformer } from "./auth.directive.js";
import { selfDirectiveTransformer } from "./self.directive.js";
import { adminDirectiveTransformer } from "./admin.directive.js";
import { ownerDirectiveTransformer } from "./owner.directive.js";
import { memberDirectiveTransformer } from "./member.directive.js";

export default {
  authTransformer: authDirectiveTransformer,
  selfTransformer: selfDirectiveTransformer,
  adminTransformer: adminDirectiveTransformer,
  ownerTransformer: ownerDirectiveTransformer,
  memberTransformer: memberDirectiveTransformer,
}
