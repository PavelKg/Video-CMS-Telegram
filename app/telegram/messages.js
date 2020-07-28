const start_and_token = `Please wait. We are checking your information...`
const start = ''

const welcome = (payload) => {
  try {
    const {first_name} = payload
    return {
      text: `Welcome ${first_name} !!!`,
      options: keyboard //{parse_mode: 'Markdown'},
    }
  } catch (err) {}
}

module.exports = {
  welcome
}
