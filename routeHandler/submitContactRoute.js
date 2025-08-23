const {Contact} = require('../Models/Students');
const fs = require('fs');

const submitContactRoute = async (req, res) => {
  try {
    const contactMessagesPage = fs.readFileSync("Templates/contact-messages.html", "utf8");
    
    const { fullName, email, message } = req.body;
    //console.log(fullName, email, message);
    // Creating a new contact and save to the database
    const contact = new Contact({ fullName, email, message });
    await contact.save();
    const messages = await Contact.find({ email }).select({ fullName: 1, message: 1 });
    //console.log(messages);
    //const name = messages[0].fullName;
    let messageContent = "";
    for (let i = 0; i < messages.length; i++) {
      messageContent += `<p>${messages[i].message}</p>`;
    }
    const output = contactMessagesPage.replace(/{%MAIL%}/g, email).replace(/{%MESSAGES%}/g, messageContent);
    //const output = replaceTemplate(contactMessagesPage, messages);
    //console.log(messages);
    // Send a success response
    res.status(200).send(output);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = submitContactRoute;