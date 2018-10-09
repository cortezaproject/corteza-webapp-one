<template>
  <fieldset class="radio">
    <input
      type="radio"
      :name="group"
      :value="value"
      :id="id" @change="$emit('changed')"/>
    <label :for="id"><slot /></label>
  </fieldset>
</template>
<script>
export default
{
  name: 'radio',
  // require user param
  props:
  {
    'group':
    {
      type: String,
      required: false,
      default: '',
    },
    'value':
    {
      type: String,
      required: false,
      default: '',
    },
    'checked':
    {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data () {
    return {
      id: null,
    }
  },
  mounted () {
    this.id = 'radio-' + this._uid
  },
}
</script>
<style scoped lang="scss">
/* Variables */
$gris-bleu: #90A3B1;
$bleu: #1397CB;
$white: #ffffff;
$black: #1E2224;
$error: #E85568;
$success: #00D53E;
$jaune: #FFCC32;
$vert-bleu: #2FBC95;
$gris: #F3F3F5;

$font-family: 'Nunito', sans-serif;

fieldset {
    line-height: 1.15; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
    color: $gris-bleu;
    font-size: 1em;
    line-height: 1.4em;
}

fieldset *,
fieldset *::before,
fieldset *::after {
    box-sizing: border-box;
}

fieldset {
    margin: 0;
    font-family: $font-family;
}

.clearfix {
  &::after {
        content: '';
        display: table;
        clear: both;
    }
}

.font-light {
    font-weight: 300;
}

.font-normal {
    font-weight: 400;
}

.font-bold {
    font-weight: 700;
}

.font-large {
    font-size: 4rem;
    margin: 0;
}

.composant {
    margin-bottom: 8rem;
}

h1 {
    font-size: 3em;
    margin: 2em 0;
}

h2 {
    font-size: 1.5em;
    margin: 1em 0;
    color: $bleu;
}

.container {
    max-width: 1100px;
    margin: 0 auto;
}

.margin {
    margin-bottom: 2rem;
}

.row {
    margin-left: -15px;
    margin-right: -15px;

    [class*="col-"] {
        position: relative;
        min-height: 1px;
        padding-left: 15px;
        padding-right: 15px;
        float: left;
    }

    .col-3 {
        width: 25%;
    }

    .col-4 {
        width: 33.3333333333%;
    }
}

.color {
    padding: 2.5rem 2rem;
    text-align: center;
    background-color: #fff;
    margin-bottom: 3rem;
    box-shadow: 0 0 25px rgba(40, 47, 60, 0.05), 0 20px 25px rgba(40, 47, 60, 0.05), 0 3px 4px rgba(40, 47, 60, 0.05);

    .title {
        display: block;
    }

    .swatch {
        border-radius: 50%;
        margin: 0 auto 15px auto;
        width: 8rem;
        height: 8rem;
    }

    .hex-value {
        text-transform: uppercase;
        color: $gris-bleu;
        font-size: 1.25em;
    }
}

.table {
    background-color: $white;
    box-shadow: 0 0 25px rgba(40, 47, 60, 0.05), 0 20px 25px rgba(40, 47, 60, 0.05), 0 3px 4px rgba(40, 47, 60, 0.05);
    width: 100%;
    max-width: 100%;

    thead{
        th {
            font-size: 1em;
            color: $gris-bleu;
            text-transform: uppercase;
            font-weight: 400;
            letter-spacing: 0.2rem;
            vertical-align: bottom;
            border-bottom: 2px solid #ddd;
            text-align: left;
        }
    }

    th,
    td {
        padding: 2rem !important;
    }

    tbody {
        td {
            padding: 2rem 2rem !important;
            vertical-align: middle !important;
        }

        tr:nth-of-type(odd) {
            background-color: #f9f9f9;
        }
    }
}

.form-group {
    margin-bottom: 2rem;
    position: relative;

    label {
        display: block;
        margin-bottom: 5px;
        font-size: 11px;
        text-transform: uppercase;
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

        &::-moz-placeholder {
           color: $gris-bleu;
        }

        &:-ms-input-placeholder {
           color: $gris-bleu;
        }

        &:focus, &.focus {
            border-color: $bleu;
            outline: none;
        }

        &:disabled {
            opacity: 0.5;
        }
    }

    &.error {
        label {
            color: $error;
        }

        .is-invalid {
            border-color: rgba($error, 0.7);
            background-color: rgba($error, 0.1);
            color: $error;
        }

        &:after {
            content: '';
            background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAA5lJREFUSA2lVUtrU1EQPnNS+zDutEkUd4ooIuLe0tYiQlFxYdJ24UoqebSKWvH1A3xVK7ZNCrW4cJVExDeKtlb8BeJCEJeiSVp3tqImd/zmprc599Y0Pg7c3JlvHl/mzJxzSWHxoQF/4fvcPWY1HMqmHgj2vysXju0nUv2BBv8Buj04R4VwfBUrfoKnBcl/+EgfbM4kH/4P0Uwkvq/E1h3kqCdFr/F0aoNEcteLQyGS6PxXIol1SCSHFCAcmrS6RaJXVr3F1t18JLqnAv2ZJDESC+96J0JyC4cOpFO3WNMRNxk3gPlePpzY7QTUeouvxCBvg+NrkyjdKxxawFA6dVMpirrIWDWysu7nuhMdTmC1t/iIL/al0fEp56JoIJucEAx6ZeXD0Rj+VbKC2NI8BmQvBuSlB7dVNL4dPXkEZaVpR+J4MDuWcjAXkYCYwj5LWcOOw8J73ofJac6mXpn4TDjWWkKjgblItNL9qGTE9LW3zgTEQZM6ZmKSqETqMf7ETgcvdMdaBBObg8lbYr0kgi+pSEBZuUj8uGLrWlkr/+I8fFU+Kk9jiZ9hbFeZdkX6RCiTHHJhC0pVIrHnI/EBZuuKGUhEc3IYQOJ34/pUMJMcNDFTXpZIHAuR2GmL+aIZ5JU10ZlAJnXJi5v6kh6ZRpHtBETnvfiiDlstEvGtSSROPlbP0J9vIpsL2/ENo//UxKrJNYkK3dEdFqnn6EmTNwla1YQr54X4eG1efdke5bv6t7NVnETrV3sD3Tp9IV3XEUwPv3HjFa0qUS7ct01RcQrjtabiDonogq0zn3XjalZx3a5QduStC19Qfrt1X3oSW5UqTXpJ8CG7HMqkzskjsiuh/YdKk+VYl8VWllQ02xXfUrR4GtsVMN2J9FWckwETwzkbxDk7aWIouVCnqW1NOvnOxF0Vzfb0bS5ZPOUlwTm57iWRJIKJzUwosZJDcpn4YkUzXYlNllWaxiStNR3Qk2Fs1VEX5lFykdgNxdxvwkj8WWtfW3N69L3gNhEuy41M/IqZ17mciUaDmVSfiVWT85HYCOITph3X1SdiasUl+4EwwhuU9VMqWe9xGgukk3E4w1R7gYQKXfEk3lHTG5V8VHpFGz4dRT9T5csoTpio8b8hKccQl2PUuElk5waHvXX2mZFxVtwMmgk0ufdPKzGTiiyVYRpBxoeRawYXWIecLXvqRFhRp9tRyVBwa/DIv5IIkcSWc6ghyekc4F+zL208bhsavwAAAABJRU5ErkJggg==') no-repeat center center;
            background-size: cover;
            width: 13px;
            height: 13px;
            display: block;
            position: absolute;
            right: 10px;
            bottom: 13px;
        }
    }

    &.success {
        label {
            color: $success;
        }

        .is-valid {
            border-color: rgba($success, 0.7);
            background-color: rgba($success, 0.1);
            color: $success;
        }

        &:after {
            content: '';
            background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAYCAYAAACfpi8JAAAAAXNSR0IArs4c6QAAAvRJREFUSA3lVk1IVFEU/u6MSGVaGZpFQVH+zEhEtImomTujpOailZAtooUR1SqCjBZlbQIJjAhcFRHUItv0A6nkzCi0aZGb5j1t+qF2ghKUFuL4bue+8Q33vpnRUVGI3lvcc77z971z7rvvAf/1JVoK3c/vcQMrrsdDdTDGEjADe9VaTFVWXI4HjwCil+qsA2MTgPco/JH3su7qETH4QcDqh0Cx8sA/UOCpQnVsPHM0ZrAVghcozssXzdABuxM6CdmHDklCFtCJxPltWOIJTPEIokO3LZWO3AvWLHVCbNBSMNaO2sG7DpYqJgSDEbhHrbtkG4RohRG9T8HLG93HgA8W3lDOUqegvXrYdfgHO1UsRWSkvhSCNaoGauVpGMFuHVuE9onvQRIDFFGuR7Fb8A3e1DFnNL6BCTBvHRm/uxzOwuB3XNjCqsl3YtqK0Mbcqjkz1kXjuKphc4re+kR4N2aSQ5Rgm+bMWCe1sl3DcikJvh0zlsyxS3NhrJtynNcwRUmNxgEqI5/h8YZpN485kL0KcRnx4A0Ny6Z85RVEYiALiQfwxS5kC3EwnYhEa6KjdNjUpw4cx02u4hpMfkVFNDnRVIbfNokqDQcewxc6Q/mEC9dUfTSqKR7YT52JEIGNKgzmuQh/TN8335o3YXIySr77NF+wZ/CXnwDrmdXxTC2zI45P7dAwCrwNdPb+ciB7FVYXvU3n0liiqQRTk/1ZSLyEv/pkPiRkrtwdcSqN8sNIyu+DKHIgihJ0t6HM8xTjVh/Jh9K2lNCHwqLjqHw97cJzqgsTkaEj4TCs5CsquDadidFRJTBKui+N2QKLoqS8GTt6/uj4/Fp+RGSOEd6IWes5SRn/EkqJt9i8pgEV/VMKlpeYe4+4w2tivfCiheAZt2lOf0fjOLYUEjI+fyLSu2boBb2GXVLULsaGsb64kfbETw1fhJL/aNSkJn8IYZ2iPcKI2Ad4Wcj5nKtuqyMbvI1OWwNf6rasTsH5qmT5CZ7P/Z+w/QV509O7uWe//wAAAABJRU5ErkJggg==') no-repeat center center;
            background-size: cover;
            width: 17px;
            height: 12px;
            display: block;
            position: absolute;
            right: 10px;
            bottom: 13px;
        }
    }

    .custom-select {
        position: relative;

        .form-control {
            border: 1px $gris-bleu solid;
            border-radius: 3px;
            box-shadow: none !important;
            color: $gris-bleu;
            font-size: 14px;
            padding: 0;
            height: 40px;
            background: $white;
            width: 100%;
        }
    }
}

// Checkbox and radio buttons
fieldset {
    border: 0 none;
    margin: 0;
    padding: 0;
}

.radio,
.checkbox {
  margin: 0 0 1em;
  position: relative;
}

[type="checkbox"]:not(:checked),
[type="checkbox"]:checked,
[type="radio"]:not(:checked),
[type="radio"]:checked {
  position: absolute;
  opacity: 0;
}

[type="checkbox"]:not(:checked) + label,
[type="checkbox"]:checked + label,
[type="radio"]:not(:checked) + label,
[type="radio"]:checked + label {
  padding-left: 30px;
  cursor: pointer;
  padding-top: 2px;
}

[type="checkbox"]:not(:checked) + label::before,
[type="checkbox"]:checked + label::before,
[type="radio"]:not(:checked) + label::before,
[type="radio"]:checked + label::before {
  content: "";
  position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background: $white;
    border: 1px $gris-bleu solid;
    border-radius: 3px;
}

[type="radio"]:not(:checked) + label::before,
[type="radio"]:checked + label::before {
  border-radius: 50%;
  top: 1px;
}

[type="checkbox"]:not(:checked) + label::after,
[type="checkbox"]:checked + label::after {
  content: "";
    position: absolute;
    transform: rotate(45deg) scale(1);
    opacity: 0;
    top: 3px;
    left: 8px;
    width: 5px;
    height: 11px;
    border-right: 2px solid $white;
    border-bottom: 2px solid $white;
}

[type="radio"]:not(:checked) + label::after,
[type="radio"]:checked + label::after {
  content: "";
    position: absolute;
    transform: translate(-50%,-50%);
    top: 50%;
    left: 10px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $white;
    opacity: 0;
}

[type="checkbox"]:disabled:checked + label::before,
[type="checkbox"]:disabled + label::before,
[type="checkbox"]:disabled:checked + label::after,
[type="checkbox"]:disabled + label::after,
[type="radio"]:disabled:checked + label::before,
[type="radio"]:disabled + label::before,
[type="radio"]:disabled:checked + label::after,
[type="radio"]:disabled + label::after {
  opacity: 0.5;
}

[type="checkbox"]:disabled:checked + label::before,
[type="checkbox"]:disabled:checked + label::before  {
  background-color: $bleu;
}

[type="checkbox"]:checked:focus + label::before,
[type="checkbox"]:not(:checked):focus + label::before,
[type="radio"]:checked:focus + label::before,
[type="radio"]:not(:checked):focus + label::before {
  border: 1px dotted $bleu;
}

[type="checkbox"]:checked + label::before,
[type="radio"]:checked + label::before {
  background-color: $bleu;
  border-color: $bleu;
}

[type="checkbox"]:checked + label::after,
[type="radio"]:checked + label::after {
  opacity: 1;
}

.toggle {
  position: relative;
  margin-bottom: 15px;
}

[type="checkbox"]:not(:checked) + label.custom-toggle,
[type="checkbox"]:checked + label.custom-toggle,
[type="radio"]:not(:checked) + label.custom-toggle,
[type="radio"]:checked + label.custom-toggle {
  padding-left: 70px;
    padding-top: 5px;
    display: inline-block;
}

[type="checkbox"]:not(:checked) + label.custom-toggle::before,
[type="checkbox"]:checked + label.custom-toggle::before,
[type="radio"]:not(:checked) + label.custom-toggle::before,
[type="radio"]:checked + label.custom-toggle::before {
        right: 0;
        bottom: 0;
        background-color: #ced4da;
        border: 0 none;
        transition: .4s;
        border-radius: 60px;
        height: 30px;
        width: 60px;
}

[type="checkbox"]:not(:checked) + label.custom-toggle::after,
[type="checkbox"]:checked + label.custom-toggle::after,
[type="radio"]:not(:checked) + label.custom-toggle::after,
[type="radio"]:checked + label.custom-toggle::after {
        height: 32px;
        width: 32px;
        left: -1px;
        bottom: 0;
        background-color: $white;
        transition: .4s;
        border-radius: 50%;
        opacity: 1;
        top: -1px;
        box-shadow: 0 0 25px rgba(40, 47, 60, 0.05), 0 10px 15px rgba(40, 47, 60, 0.05), 0 3px 4px rgba(40, 47, 60, 0.05);
}

[type="checkbox"]:checked + label.custom-toggle::before,
[type="checkbox"]:checked + label.custom-toggle::before  {
  background-color: $bleu;
}

[type="checkbox"]:checked + label.custom-toggle::after,
[type="checkbox"]:checked + label.custom-toggle::after  {
  transform: translateX(30px);
}

.btn {
    height: 40px;
    border-radius: 40px;
    padding: 0 40px;
    color: $white;
    font-size: 16px;
    cursor: pointer;
    font-family: $font-family;

    &.btn-small {
        height: 25px;
        font-size: 12px;
        padding: 0 25px;
        border-radius: 25px;
    }

    &.btn-outline {
        border: 1px solid;

        &.btn-1 {
            border-color: $gris-bleu;
            color: $gris-bleu;

            &:hover {
                border-color: darken($gris-bleu, 10);
            }
        }

        &.btn-2 {
            border-color: $bleu;
            color: $bleu;

            &:hover {
                border-color: darken($bleu, 10);
            }
        }

        &.btn-3 {
            border-color: $jaune;
            color: $jaune;

            &:hover {
                border-color: darken($jaune, 10);
            }
        }

        &.btn-4 {
            border-color: $vert-bleu;
            color: $vert-bleu;

            &:hover {
                border-color: darken($vert-bleu, 10);
            }
        }

        &.btn-5 {
            border-color: $black;
            color: $black;

            &:hover {
                border-color: darken($black, 10);
            }
        }

        &.btn-6 {
            border-color: $gris;
            color: $gris;

            &:hover {
                border-color: darken($gris, 10);
            }
        }

        &.btn-7 {
            border-color: $error;
            color: $error;

            &:hover {
                border-color: darken($error, 10);
            }
        }

        &.btn-8 {
            border-color: $success;
            color: $success;

            &:hover {
                border-color: darken($success, 10);
            }
        }
    }

    &.btn-pill {
        border: 0 none;

        &.btn-1 {
            background: $gris-bleu;

            &:hover {
                background: darken($gris-bleu, 10);
            }
        }

        &.btn-2 {
            background: $bleu;

            &:hover {
                background: darken($bleu, 10);
            }
        }

        &.btn-3 {
            background: $jaune;

            &:hover {
                background: darken($jaune, 10);
            }
        }

        &.btn-4 {
            background: $vert-bleu;

            &:hover {
                background: darken($vert-bleu, 10);
            }
        }

        &.btn-5 {
            background: $black;

            &:hover {
                background: darken($black, 10);
            }
        }

        &.btn-6 {
            background: $gris;
            color: $black;

            &:hover {
                background: darken($gris, 10);
            }
        }

        &.btn-7 {
            background: $error;

            &:hover {
                background: darken($error, 10);
            }
        }

        &.btn-8 {
            background: $success;

            &:hover {
                background: darken($success, 10);
            }
        }
    }
}

.notification {
    background: $gris-bleu;
    padding: 15px 55px;
    margin-bottom: 10px;
    position: relative;
    font-size: 0;
    border-radius: 3px;

    .close {
        width: 16px;
        height: 16px;
        display: block;
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAS1JREFUWAnNV9sOwyAINfu7vvVt/5/+xhYHThPLkHKp7Uhco8A5h0pdTDnnBcZWx5omG/CsHd+S6gQexV7w+5ylAbFhIEezjQpAxxQRgEvJkasIwFfSq0LHqSIAjyNHju+WCwHh7VBjqwMNDWLGNCcIYtxY7sROTBgjAhDJ7WpI+HmOOnfYmJ6cHSmdWAAtsZRHnGuANTEiyZFTIpB8R7gm/4DoDes4ejv1FN2JBBauMa8hb0qqCFo1isC14RfS8unzQRf+el6rp/+cWH2zy/f/miaE8rjmK9VKvlO2U0OgiXGJsQBbYlViPICeHFZMBCiSW8SEAQDFjeFOZN6jGcucwJDSJTWmOpAyKOaH2BBw78UEBODFtLcp5zkQcKfpz91wCnnbKUZEEXDr9fwDrynRQr4vpzgAAAAASUVORK5CYII=') no-repeat center center;
        background-size: cover;
        cursor: pointer;
    }

    p {
        color: $white;
        font-size: 14px;
        margin: 0;
        letter-spacing: 1px;
        display: inline-block;
        vertical-align: middle;
    }

    &.success,
    &.info,
    &.error {
        &::before {
            content: '';
            width: 32px;
            height: 32px;
            display: block;
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
        }
    }

    &.success {
        background: $success;

        &::before {
            background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABe9JREFUeAHlm7+OHEUQxr1YcmZhyT4SxOkiDFgkbGjsVyA4S0g4wRY8wQVIRBdZAun8BA5ILiAzyT0AdoItHFiywCQbOAIfJCdZMgKO37f0zBW1M7PdvfPP2pI+TU//qfqqZqanu6dncqpjOT4+3sDEVXAJXARvgwvgbACHU0cBhxx/AU/BE/D9ZDJ5zvHVEpyegj3wGPwDckVtpUO6pqOOAgTPgh3wBHQl0i0bunvGIZA5B3bBH6AvkS3ZPLdqFCa5CjCutp+Cr4Ge6Tr5m4JH4B74OeAZx+K5J1n2B2+RfifgCscPwGlQJ+ofvgDf0Fcc11VqPR/nN8F9UCd/UnAXbIPXcwmoLbgGpEs660RcNnPtJLXD0GXwaw2TF+TfAueTlEZURueFoFs2qkScLkeoyq+CgZvgZYX1v8i7A97M1x7XUjaCLdn0Im434zQl1ELpaXDbWwvnBxzfS1DXSlXZBLJdJeLa1HfEc5Ai8F2FFb2jv4zX1E1NcQBVYw1xXj0IKKm68kfkf9SNS+laxQWIk5fb6dpMC7TpmfcyI+N9U20USXEC4uYlr09Ai3p73+HNyHtjFB5XkBA3II5W5EPa24EGm8C/6nSLje7K+ziII/CPg3yJGydQcQL8IEedzGieee+0PxdXIM5W5NPykS+VbthWIT14b++dXHYOb70dvNxobEdtTWyeu1YHjY1GXIgffpzwm3yspUyhZlhWNNrqfZBTSzCxQNyBHzHuVqqhoubzmmZauVNZ+RXKxBkN0a3Ix8X1BDJ3bC3SL0DnY/ucWMLrYyGmrXwA8sXKzkJbSv1Kzq2FSiPIgKec120txAZBM1QrWm88EUqmtpS05t6tT2lPLOal4FQ4X9CNCgKVNZX26wlTsXgtUPnEUTpgheV3lzfoqZyHwD5InuDgi1ab/dvsxGeUa+XVyvag3jrjEPNXXlyjrn6hivpaWbLyeF5GzgawoyYpzl7GKgy2dYTLys6Li3wC8q0Q+byhgu0iJxx/aIv8qnrg04rzBQ/0PXC+bqsP0BcbK/ftyVBpOY9t/8xrhfk6z/S3mbzuuXaXFAB9rrLykz0ZIt2R83LF+3ZRj8BDd1toPX4wkfPAPquil9Th1ZFHzxUpM/JQAZiZDCW36hR0nY/tzpwXd/kmB43MlHloMpQcZACE3U6dDwE473w9VAD8steZ1CsdyKvTypI+nBcx7JwBVl6uHAC0FVcu6zk17S2xLF3Loo+BygBkPwIV5JOIV7RXEJJ0LHPalqO78hGYyaqRLduoKU2b4uqb5nEOrNK2iVNTGTa3LFHS805wpddgjiM5bZociy3D7lVgZf4a3Lc5pD+LVVjUo030nZBSt9Df1hHbnwMr+xoJakOSlXftSUw6DE2vU1dD1UI0bVVwy7dDSLc9vC3sxRy1+cLKU70F/GToga2RkpaDQJ2YlXmnRkZtWYqNVerCYWEypAC0Oh1ucLQyMKs4lNIWXtXTYSmh0C+IXEtR7uvWBIHsUjp71XkuxTmWqxdEVIHCvZLaf4m7RcPcI2qqbnlp79354KP2GVnZK30jd2pLSLeyKIoeH4ShnK9dFLVB6GRZ3ARhEOfD1W9eFg+Vdtxd0NqHkRCE8nVYRr2HBLajP4ys96excBfsurtAt+16fBwNAdDncX1CtuI/KPRw47ZjAifSPo+HIKzvBokQgPXeIhOCsMnts56bpIqnjwCs7zY5E4T13ShpgrC+W2VDf7Dem6VNEKruBI0X9K7tfbAkm8E2hwUR1+SNFMVdX3tE6Xr+MGEjQhD0dvCvSLLmogmUZl6tf15Dp6a00i0bVSJOaZuirWMpaQxpnOD3E1tSWk/QAoTWG7N3m6gt0EqOdPlNTmSVkv3T1PLNwzWRwXTx29xXVNHvsXWileIfgTZe6Pu8VqGfgaMADv/7bU77FbQy/SGYgqZneZjf5iBVCoHQBEqzSO3A7EtkSzbr9/2WDHtKQEbrCVpU8StLZLUm0i0bi1tde/IzygwEp0ALraP/eTq7D4iKBJUIwqh/n/8XJgZAtnptnccAAAAASUVORK5CYII=') no-repeat center center;
            background-size: cover;
        }
    }

    &.info {
        background: $bleu;

        &::before {
            background: url('data:image/png;base64,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') no-repeat center center;
            background-size: cover;
        }
    }

    &.error {
        background: $error;

        &::before {
            background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABV1JREFUeAHtm7tuFDEUhndJHYFEkgZIyVU0bMnlFSigQhSEV0iBRJUqEkjwBCmoqKFJQwe0UCBFQJoUkZC4BAlFQgIB4fuDd3NydmaZmbWH3VmO9O94Pfa5je2xjz3tVmLa2dmZRcQlcAacAMfBDJgO4NLaDvjEdR28BWvgabvd/sh1vAijO+AeeAV+gaqkuuIhXp2R9gIKToNFsAZSkXhLhlrPaBDKHAJL4DOoiyRLMg8N64V2VQYIV90b4C5Qn86jn9x4CZ6BNwGbXLv9nmRvPDhG+mTARa7nwBTII40Pt8ADxoqdvELR8zF+HjwHefSdG4/AFXCwqgKqC64C8RLPPJIu81XllKqHoPPgfY4mX8lfBodLMS1QGJ4zgbdkZJF0Ol+AVfUiCLgJvmVI/0HeCjhSnXuxmpIRZEmmJ+l2sxinEqVgOgXue2nh/yrX0yXYRSkqmUCys0i6Dho7iusgRuBxhhS9o28X55SmpHQAWXMN6Ty8E2CS9eS3yb+cxqTyXKULkE6e7pfnZmrATX3e0wYZZ02xkUhKJyDdPFUbE+Ci0d4PeBvkzcWwGD77KBLPOZhu7GP8x4ZybwcYzAP/qlMTi/bknZLRJjHSEfjuIFuKzRMo2AZ+kqNBJmqfh98+itECujxgrDFBOluSTX+f+VJowdYK6eijvZfRVT7WFf56O3haGMif0lrYfHS1VgdWqnjTyYjWBaw6yPDzhA/k5S+guKkVliXNtpJMcqwQpa3isdLSHfgZ41ImfwpqPa9lpqWVzMIRMq0QpSOwzGQBa03RLcnG/ngCmYu2FOmvINnc3slK6QCtHWSLpcU+b3HXR3KW+wpFzLDaKB2RdR8r2GuFaknxxj3iTsfeJa21d/Ql7Z7EVsvJS+0ALaV9PKEjfQ4Epa5Z5UivEmHZcnlj+xdbFG32b7M9m/GOIq+WrqS21gpTugZ5iixZerUrk5xZYGdNem1UDmMVNcRqonTRelXLySZgX4myeVZdQJsWdor4gibzpaqgUa0XbFJwtkuy+ZIcoB0bS8/tn4alnzl7zsgB2q6y9Nr+aVja23ZCDtBenSXtyzWVvG3H5QC/qbHZVOuxy9s2Iwf4efF2gx3gbZv+74AGP+1CpqkF9DWLQjXHs1Bfd//vAB6kFgqWtEXdVPKR4U9qAevOWj8xcrfH+q+3bV0O8JODU2Nt4mDldfjC0ls5YH90pNXSyYymkrdtTZGZiV4O7z5pnOADIleb1gSwMTMgoi4gevLn0vu93ks1J+Ft2rMZ79QeFK3Tr9iXGxTt6UGhWsPiPcE1JLBtcFhcOlCoto0RZB0FD8G7AKWPpvAFfAtvjNSyNSZDwRbwpLzoToDnihOUvTUWWkHyzVGU0dPOo4cxWwFCim+OBgdoe1xbyJb8hsJQOsJYzT6P3g3F3FVGSLnt8eCEpAckUKoWByCn/AGJ4ICkR2RQLHkXQEb1IzLBCfMwSXJICr5JB0H4nwXbwFLxQ1LdbkTtZMfk4J3kNQjfObABLOmoX7ljcsYJk3tQ0jhhco/KhvFgsg9LGydktQT1Nb1rk5wk67bCrKtkBtlc+ki6Dn9S3AuG6WR+MGEdgRP0dvCvSLJ2SaexlsFhWydGGp5a0oq3ZGSRdKo22pdVEEGaJ/jzxFYpHUgai4+m7MmQUn7AQNW9Ae4AfR6bRz+58QLo4IX25xWF1i6tdqS6u1LasRG0J6HQtSLTF0AHDOrL/+azOZTqEY7QAkqrSC0z6yLJksz8c789DWtKoIziCQqq+MgSWdFIvCXD7/HVZGVBMSjYAffAyH88XXkMKOgLhdo0Pugkmg5jqX/rSM7IfD7/GyApbnrYPkA7AAAAAElFTkSuQmCC') no-repeat center center;
            background-size: cover;
        }
    }
}
</style>
