export default class Reply {

  constructor(id, text, who) {
    if (!id || id == "") {
      throw new Error("Invalid Reply id: ", id);

    } else if (who == "client" || who == "admin") {
      this.id = id;
      this.who = who;
      this.text = text || "";

    } else {
      throw new Error("Invalid who value for Reply, it must be either client or admin")
    }
  }

  getData() {
    text: this.text,
    who: this.who
  }
}