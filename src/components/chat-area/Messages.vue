<script lang="tsx">
import { MessagesModule } from "@/store/modules/messages";
import MessageTemplate from "./message/MessageTemplate.vue";
import ActionMessageTemplate from "./message/ActionMessageTemplate.vue";
import Vue from "vue";
import Message from "@/interfaces/Message";

export default Vue.extend({
  functional: true,
  props: {
    channelID: String
  },
  render(h, { props }) {
    const messages = MessagesModule.messages[props.channelID];

    const isMoreThanMinute = (before: Message, after: Message) => {
      const minute = 60000;
      const beforeTime = before.created;
      const afterTime = after.created;
      return afterTime - beforeTime > minute;
    };
    const creatorMatch = (before: Message, after: Message) =>
      before.creator.id === after.creator.id;

    const messageComponent = (grouped: boolean, m: Message) =>
      h(m.type === 0 ? MessageTemplate : ActionMessageTemplate, {
        props: { message: m, grouped: grouped },
        key: m.tempID || m.messageID
      });

    let groupCount = 0;

    return messages.map((m, index) => {
      const beforeMessage = messages[index - 1];

      if (!beforeMessage || !creatorMatch(beforeMessage, m)) {
        groupCount = 0;
        return messageComponent(false, m);
      }

      if (groupCount >= 4 || isMoreThanMinute(beforeMessage, m)) {
        groupCount = 0;
        return messageComponent(false, m);
      }
      groupCount += 1;
      return messageComponent(true, m);
    });
  }
});
</script>
