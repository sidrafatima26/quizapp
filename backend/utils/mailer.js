const { exec } = require('child_process');

// Function to send an email using Python script
const sendMail = (email, subject, message) => {
  return new Promise((resolve, reject) => {
    // Escape quotes and newlines in the subject and message to avoid issues in Python
    const escapedSubject = subject.replace(/(["\n\r])/g, '\\$1');
    const escapedMessage = message.replace(/(["\n\r])/g, '\\$1');

    // Path to the Python executable and the script
    const pythonExecutable = '"C:/Python312/python.exe"'; // Adjust this to your Python path if needed
    const pythonScriptPath = '"C:/Users/kholoods/react/quizapp/backend/scripts/send_mail.py"'; // Corrected path to the script

    // Log the command for debugging
    console.log(`Executing command: ${pythonExecutable} ${pythonScriptPath} "${email}" "${escapedSubject}" "${escapedMessage}"`);

    // Run the Python script with parameters
    exec(`${pythonExecutable} ${pythonScriptPath} "${email}" "${escapedSubject}" "${escapedMessage}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${stderr}`);
        reject(new Error(`Failed to send email: ${stderr}`));
      } else {
        console.log(stdout); // Log the Python script output
        resolve('Email sent successfully');
      }
    });
  });
};

module.exports = sendMail;
