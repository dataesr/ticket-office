import EmailSender from "../../../api/send-mail";
import { StaffActionsProps } from "../../contact-contributionbyobject-page/types";
import "./styles.scss";

const StaffActions: React.FC<StaffActionsProps> = ({ data, refetch }) => {
  return (
    <>
      <EmailSender contribution={data} refetch={refetch} />
    </>
  );
};

export default StaffActions;
