import { authDirectiveTransformer } from "./auth.directive.js";
import { selfDirectiveTransformer } from "./self.directive.js";
import { adminDirectiveTransformer } from "./admin.directive.js";
import { ownerDirectiveTransformer } from "./owner.directive.js";
import { ownerOrAdminDirectiveTransformer } from "./ownerOrAdmin.directive.js";
import { memberDirectiveTransformer } from "./member.directive.js";
import { memberOrAdminDirectiveTransformer } from "./memberOrAdmin.directive.js";

export default {
  authTransformer: authDirectiveTransformer,
  selfTransformer: selfDirectiveTransformer,
  adminTransformer: adminDirectiveTransformer,
  ownerTransformer: ownerDirectiveTransformer,
  ownerOrAdminTransformer: ownerOrAdminDirectiveTransformer,
  memberTransformer: memberDirectiveTransformer,
  memberOrAdminTransformer: memberOrAdminDirectiveTransformer,
}
