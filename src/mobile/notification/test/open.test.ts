import { expect, fixture, elementUpdated } from "@open-wc/testing";
import { MobileNotification } from "../index";

describe("MobileNotification", () => {
  describe("open", () => {
    it("should be display when call open() method", async () => {
      const container = new MobileNotification();
      container.open();

      const parrentEl = container.parentNode as HTMLElement;
      expect(parrentEl.nodeName).to.equal("BODY");

      expect(container.classList.length).to.equal(1);
      expect(container.classList[0]).to.equal("kuc-mobile-notification-fadein");
    });
  });
});
