export default class Reply {

  constructor(replyData) {
    if (!replyData.id || replyData.id == "") {
      throw new Error("Invalid Reply id: ", replyData.id);

    } else if (replyData.who == "client" || replyData.who == "admin") {
      this.id = replyData.id;
      this.who = replyData.who;
      this.text = replyData.text || "";
    } else {
      throw new Error("Invalid who value for Reply, it must be either client or admin")
    }
  }

  getData() {
    return {
      text: this.text,
      who: this.who
    }
  }
}
