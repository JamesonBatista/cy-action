const styles = require("./styles");
export function Scenario(text, callback) {
  styles();
  describe(`sᴄᴇɴᴀʀɪᴏ  - ${text}`, function () {
    callback();
  });
}
export function Given(text, callback) {
  it(`ɢɪᴠᴇɴ - ${text}`, callback);
}
export function When(text, callback) {
  it(`ᴡʜᴇɴ - ${text}`, callback);
}

export function And(text, callback) {
  it(`ᴀɴᴅ - ${text}`, callback);
}

export function Then(text, callback) {
  it(`ᴛʜᴇɴ - ${text}`, callback);
}
