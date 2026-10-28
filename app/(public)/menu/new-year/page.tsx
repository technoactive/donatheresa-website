import { FestiveMenuPage } from "@/components/public/festive-menu-page"
import { newYearMenu } from "@/lib/festive-menus-data"

export default function NewYearMenuPage() {
  return <FestiveMenuPage menu={newYearMenu} />
}
