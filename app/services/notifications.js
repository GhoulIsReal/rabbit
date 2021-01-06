import MicroMQ from "micromq";
import env from "../../env";
import mailer from "../mailer";

const notifications = new MicroMQ({
  name: "notifications",
  rabbit: {
    url: env.rabbit_url,
  },
});

notifications.action("notify", (meta) => {
  const { user, itemName } = meta;
  console.log(user, itemName);
  mailer({
    from: "no-reply-rabbit@mail.ru",
    to: user.email,
    subject: "Notification from Rabbit",
    html: `Hello ${user.first_name}, your item(${itemName}) was sold !`,
  });
});

notifications.start();
