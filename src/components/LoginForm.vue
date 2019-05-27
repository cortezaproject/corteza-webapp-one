<template>
  <form
    method="post"
    class="login-form"
    enctype="application/x-www-form-urlencoded"
    action="https://auth.crust-poc.daasi.de/handle_discovery_response">
    <section class="login-fields">
      <fieldset class="manual-signon">
        <input type="hidden" id="internal" name="target" value="ldap" checked/>
        <label for="internal"> Login with username/password</label>
        <!-- label for="username"> Username: </label -->
        <input type="text" name="ldap-username" placeholder="Username" value="">
        <!-- label for="password"> Password: </label -->
        <input type="password" name="ldap-password" placeholder="Password" value="">
        <button type="button" @click="connect" class="login-btn">Connect</button>
      </fieldset>
      <div class="or">or</div>
      <fieldset class="sso-signons">
        <div class="sso-provider-wrap google">
          <input type="radio" hidden id="google" name="target" value="google"/>
          <label for="google" @click="connect"><i class="icon-google"></i><span
            class="text">Login with <strong>Google</strong></span></label>
        </div>
        <div class="sso-provider-wrap facebook">
          <input type="radio" hidden id="facebook" name="target" value="facebook"/>
          <label for="facebook" @click="connect"><i class="icon-facebook"></i><span class="text">Login with <strong>Facebook</strong></span></label>
        </div>
        <div class="sso-provider-wrap saml2">
          <input type="radio" hidden id="Saml2" name="target" value="Saml2"/>
          <label for="Saml2" @click="connect"><i class="icon-fatlock"></i><span
            class="text">Login with <strong>SAML2</strong></span></label>
        </div>
      </fieldset>
    </section>
  </form>
</template>

<script>
export default {
  name: 'LoginForm',

  computed: {
    user: {
      get () {
        return (this.$store.state.user)
      },
    },
  },

  methods: {
    connect () {
      this.$store.commit('user/connectUser')
    },
  },
}
</script>

<style scoped lang="scss">
  $font-family: Arial, sans-serif;

  .sso-signons {
    max-width: 100%;
  }

  .manual-signon {
    text-align: center;

    label {
      display: block;
      text-align: left;
    }

    label,
    input,
    button {
      margin: 10px 0 0 0;
    }
  }

  .sso-provider-wrap {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    label {
      display: inline-block;
      width: 100%;
      border-radius: 5px;
      background-color: $success;
      height: 40px;
      line-height: 40px;
      margin: 0 0 10px 0;
      color: white;
      vertical-align: middle;

      &:hover {
        background-color: darken($success, 10);
      }

      .text,
      i {
        padding: 0 10px;
        display: inline-block;
        color: white;
        line-height: 1;
        vertical-align: middle;
      }

      i {
        border-right: solid 1px white;
        font-size: 20px;
        width: 40px;
        text-align: center;
      }
    }

    &.google label {
      background-color: $danger;
    }

    &.facebook label {
      background-color: $primary;
    }

    &.google label:hover {
      background-color: darken($danger, 10);
    }

    &.facebook label:hover {
      background-color: darken($primary, 10);
    }
  }

  fieldset {
    border: none;
  }

  .login-form {
    height: 100%;
    width: 100%;
  }

  .login-fields {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    width: 90%;
    min-width: 200px;
    max-width: 400px;
    padding: 20px;
    margin: 0 auto;
    background-color: #FFF;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .login-btn {
    outline-color: transparent;
    border: none;
    height: 40px;
    border-radius: 40px;
    padding: 0 40px;
    color: $white;
    font-size: 16px;
    cursor: pointer;
    font-family: $font-family;
    background: $warning;

    &:hover {
      background: darken($warning, 10);
    }
  }

  .or {
    margin: 10px 0;
    text-align: center;
    width: 100%;
    opacity: 0.5;

    &::before,
    &::after {
      content: "\00a0";
      border-bottom: solid 1px grey;
      min-width: 30px;
      display: inline-block;
      vertical-align: middle;
      margin: -0.5em 1em 0 1em;
      height: 0.5em;
      overflow: hidden;
    }
  }

  input[type="text"],
  input[type="email"],
  input[type="password"] {
    border-radius: 3px;
    width: 100%;
    height: 40px;
    padding-left: 10px;
    border: 1px solid $gris-bleu;
    color: $gris-bleu;
    font-size: 14px;
    font-family: $font-family;

    &::-webkit-input-placeholder {
      color: $gris-bleu;
    }

    &:-moz-placeholder {
      color: $gris-bleu;
    }

    &:-ms-input-placeholder {
      color: $gris-bleu;
    }

    &:focus,
    &.focus {
      border-color: $bleu;
      outline: none;
    }

    &:disabled {
      opacity: 0.5;
    }
  }
</style>
