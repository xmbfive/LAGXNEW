import { Router } from "express"
import authenticateToken from "../util/DecodeJWT";
import { CreateCombo } from "../Combo/CreateCombo";
import { AllComboForAdmin } from "../Combo/AllComboForAdmin";
import { AllComboForUser } from "../Combo/AllComboForUser";
import { MatchCombo } from "../Combo/MatchCombo";
import { DeleteComboAdmin } from "../Combo/DeleteComboAdmin";
import { ResetCombo } from "../Combo/ResetCombo";
const ComboRoute = Router();
ComboRoute.post("/create-new-combo", CreateCombo);
ComboRoute.get("/all-combo", AllComboForAdmin);
ComboRoute.delete("/delete-combo", DeleteComboAdmin);
ComboRoute.delete("/delete-combo-track", ResetCombo);
ComboRoute.get("/all-combo-user", authenticateToken, AllComboForUser);
ComboRoute.post("/match-combo", authenticateToken, MatchCombo);
export default ComboRoute;

