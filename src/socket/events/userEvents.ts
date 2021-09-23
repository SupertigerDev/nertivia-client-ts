import { MeModule } from "@/store/modules/me";
import { CustomStatusesModule } from "@/store/modules/memberCustomStatus";
import { programActivitiesModule } from "@/store/modules/memberProgramActivity";
import { PresencesModule } from "@/store/modules/presences";
import { UsersModule } from "@/store/modules/users";

interface StatusChange {
  user_id: string;
  status: number;
  connected?: boolean;
  custom_status?: string;
}
export const onStatusChange = (data: StatusChange) => {
  if (data.user_id === MeModule.user.id) return;
  if (data.status === 0) {
    programActivitiesModule.RemoveProgramActivity({ id: data.user_id });
    CustomStatusesModule.RemoveCustomStatus({ id: data.user_id });
  }
  PresencesModule.UpdatePresence({
    presence: data.status,
    id: data.user_id
  });
  if (data.connected) {
    if (!data.custom_status) {
      CustomStatusesModule.RemoveCustomStatus({ id: data.user_id });
      return;
    }
    CustomStatusesModule.SetCustomStatus({
      custom_status: data.custom_status,
      id: data.user_id
    });
  }
};
export const onSelfStatusChange = (data: { status: number }) => {
  MeModule.UpdateUser({ status: data.status });
};
export const onCustomStatusChange = (data: {
  custom_status: string;
  user_id: string;
}) => {
  CustomStatusesModule.SetCustomStatus({
    custom_status: data.custom_status,
    id: data.user_id
  });
};
export const onSelfCustomStatusChange = (data: { custom_status: string }) => {
  if (!MeModule.user.id) return;
  CustomStatusesModule.SetCustomStatus({
    custom_status: data.custom_status,
    id: MeModule.user.id
  });
};
export const onProgramActivityChange = (data: {
  name?: string;
  status?: string;
  user_id: string;
}) => {
  if (!data.name || !data.status) {
    programActivitiesModule.RemoveProgramActivity({
      id: data.user_id
    });
    return;
  }
  programActivitiesModule.SetProgramActivity({
    id: data.user_id,
    name: data.name,
    status: data.status
  });
};
export const onGoogleDriveLinked = () => {
  MeModule.UpdateUser({ googleDriveLinked: true });
};
export const onUserBlocked = (id: string) => {
  UsersModule.blockUser(id);
};
export const onUserUnblocked = (id: string) => {
  UsersModule.unblockUser(id);
};
