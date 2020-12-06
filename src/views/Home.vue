<template>
  <div class="home">
    <Header />
    <div class="center-box">
      <div class="slideshow">
        <img class="logo" src="@/assets/logo.svg" alt />
        <div class="title">Welcome to Nertivia BETA</div>
      </div>
      <div class="main-content">
        <div class="buttons">
          <a href="/app" class="button">
            <div class="material-icons">open_in_browser</div>
            <div class="name">Open In Browser</div>
          </a>
          <!-- <div class="button" @click="setPopout('download')">
            <div class="material-icons">vertical_align_bottom</div>
            <div class="name">Download</div>
          </div> -->
        </div>
        <br />
        <a
          class="button github"
          href="https://github.com/supertiger1234/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img class="icon" src="@/assets/github-logo.svg" alt />
          <div class="name">View In GitHub</div>
        </a>
      </div>
    </div>
    <div class="footer">
      <a href="https://nertivia.net/privacy">Privacy Policy</a>
      <a href="https://nertivia.net/terms-and-conditions"
        >Terms And Conditions</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/home-page/Header.vue";

@Component({ components: { Header } })
export default class Home extends Vue {}
</script>

<style scoped lang="scss">
.home {
  color: white;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.center-box {
  display: flex;
  align-self: center;
  margin-top: 200px;
}
.slideshow {
  display: flex;
  flex-direction: column;
  height: 370px;
  width: 370px;
  align-items: center;
  margin: 10px;
  justify-content: center;
  align-content: center;
  border-right: solid 1px rgba(255, 255, 255, 0.315);
  .logo {
    height: 200px;
    width: 200px;
  }
  .title {
    text-align: center;
  }
}
.main-content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 370px;
  width: 370px;
  margin: 10px;
}
a {
  text-decoration: none;
  color: white;
}
.button {
  display: flex;
  align-items: center;
  align-content: center;
  padding: 10px;
  font-size: 14px;
  transition: 0.2s;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  background: var(--primary-color);
  align-items: center;
  justify-content: center;
  user-select: none;
  align-content: center;
  margin: 5px;
  cursor: pointer;
  border-radius: 4px;
  .material-icons {
    margin-right: 5px;
  }

  &.github {
    background: white;
    align-self: center;
    color: black;
    .name {
      margin-left: 5px;
      color: black;
    }
  }
  .icon {
    height: 30px;
    width: 30px;
  }
  &:hover {
    opacity: 0.8;
  }
}
.buttons {
  display: flex;
  .button {
    flex: 1;
    white-space: pre;
  }
}
.changelog {
  margin-top: 10px;
  margin-bottom: 10px;
}
.features-button {
  display: flex;
  flex-direction: column;
  align-self: center;
  margin-top: 60px;
  align-content: center;
  align-items: center;
}
.features-list {
  margin-top: 60px;
  margin-bottom: 50px;
  align-self: center;
  .feature {
    margin-top: 40px;
    .details {
      max-width: 350px;
      margin: auto;
      margin-right: 0;
    }
    .title {
      font-weight: bold;
      font-size: 24px;
      margin-bottom: 10px;
    }
    .description {
      opacity: 0.7;
    }
    .material-icons {
      font-size: 150px;
      align-self: center;
      height: initial !important;
      margin: auto;
    }
    .image {
      height: 200px;
      width: auto;
      &.upload {
        width: 250px;
        height: auto;
        margin-left: 50px;
      }
    }
    display: flex;
  }
}

.footer {
  width: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  min-height: 30px;
  flex-wrap: wrap;
  flex-shrink: 0;
  justify-content: center;
}
.footer a {
  color: #68aaff;
  text-decoration: underline;
  margin: 10px;
}
@media (max-width: 790px) {
  .slideshow {
    border: none;
    width: 100%;
    flex-shrink: 0;
    margin: 0;
    height: 300px;
  }
  .main-content {
    width: 400px;
    margin: 0;
    height: initial;
  }
  .center-box {
    flex-direction: column;
    width: 400px;
    margin-top: 0px;
  }
}

@media (max-width: 403px) {
  .main-content,
  .center-box {
    width: 100%;
  }
}
@media (max-width: 306px) {
  .feature .image {
    width: 100% !important;
    height: auto !important;
  }
  .buttons {
    flex-direction: column;
  }
}
@media (max-width: 849px) {
  .features-list {
    .feature {
      flex-direction: column;
    }
    .image {
      margin: auto !important;
    }
  }
  .features-list .details {
    text-align: center;
    margin-left: 0 !important;
    margin-top: 20px;
  }
}
</style>
