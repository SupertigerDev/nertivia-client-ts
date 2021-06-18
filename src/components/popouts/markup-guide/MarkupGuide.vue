<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="markup-guide-popout">
      <div class="content animate-in">
        <div class="header">
          <div class="material-icons close" @click="close">close</div>
          <div class="main-title">Markup Guide</div>
        </div>
        <div class="list">
          <div class="guide" v-for="(guide, i) in guides" :key="i">
            <!-- <div class="title">{{ guide.title }}</div> -->
            <code class="usage">{{ guide.example }}</code>
            <div class="markup"><Markup :text="guide.example" /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Markup from "@/components/Markup";

import { PopoutsModule } from "@/store/modules/popouts";

@Component({
  components: {
    Markup
  }
})
export default class MarkupGuide extends Vue {
  close() {
    PopoutsModule.ClosePopout("markup-guide");
  }
  backgroundClick(event: any) {
    if (event.target.classList.contains("popout-background")) {
      this.close();
    }
  }
  get guides() {
    return [
      {
        title: "Bold",
        example: "**Bold**"
      },
      {
        title: "Italics",
        example: "//Italics//"
      },
      {
        title: "Underline",
        example: "__Underline__"
      },
      {
        title: "Strikethrough",
        example: "~~Strikethrough~~"
      },
      {
        title: "Spoiler",
        example: "||Spoiler||"
      },
      {
        title: "Inline Code",
        example: "`Inline Code`"
      },
      {
        title: "Code Block",
        example: "```js\nconsole.log('Code Block');\n```"
      },
      {
        title: "Block Quote",
        example: "> Block Quote"
      },

      {
        title: "Named Links",
        example: "[link: example.com -> Link Text]"
      },
      {
        title: "Color",
        example: "[#3ee]Color [#reset]Normal"
      }
    ];
  }
}
</script>
<style lang="scss" scoped>
.popout-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.658);
  z-index: 99999999999999999999999999999;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}
.markup-guide-popout {
  display: flex;
  background: var(--popout-color);
  border-radius: 4px;
  width: 480px;
  max-height: 600px;
  overflow: hidden;
}

.content {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.animate-in {
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.header {
  display: flex;
  align-items: center;
  align-content: center;
  padding-left: 10px;
  height: 40px;
  flex-shrink: 0;
  background: var(--main-header-bg-color);
  .close {
    cursor: pointer;
    margin-right: 5px;
    opacity: 0.6;
    transition: 0.2s;
    &:hover {
      opacity: 1;
    }
  }
}
.list {
  display: flex;
  flex-direction: column;
  // gap: 10px;
  padding: 10px;
  border-radius: 4px;
  overflow: auto;
}
.guide {
  display: flex;
  // flex-direction: column;
  // background: var(--card-color);
  align-items: center;
  align-content: center;
  border-radius: 4px;
  padding: 10px;
  flex-shrink: 0;
  overflow: hidden;
  .title {
  }
  .usage {
    flex: 1;
    flex-shrink: 0;
    background: var(--card-color);
    border-radius: 4px;
    padding: 5px;
    white-space: pre-line;
    color: rgba(255, 255, 255, 0.7);
  }
  .markup {
    flex: 1;
    // background: var(--card-color);
    border-radius: 4px;
    padding: 5px;
    white-space: pre-line;
    color: rgba(255, 255, 255, 0.7);
    margin-left: 10px;
  }
}
</style>
