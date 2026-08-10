
import {
  Dialog,
} from "@/shared/components/ui/dialog"
import { CATEGORY_DIALOG_HANDLE } from "../category.contansts";
import AddCategoryDialogBoxContent from "./AddCategoryDialogBoxContent"



export function AddCategoryDialogBox() {
  return (
    <Dialog handle={CATEGORY_DIALOG_HANDLE}>
      {({ payload }) => payload ? <AddCategoryDialogBoxContent payload={payload} /> : null

      }
    </Dialog>
  )
}