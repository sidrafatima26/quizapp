import smtplib
import sys

email = sys.argv[1]
subject = sys.argv[2]
body = sys.argv[3]
sendersEmail = "sajidkholood@gmail.com"
password = "spkb wiqc ilfd oxbb"

# creates SMTP session
s = smtplib.SMTP('smtp.gmail.com', 587)

# start TLS for security
s.starttls()

# Authentication with the new sender Gmail address and the generated App Password
s.login(sendersEmail, password)  # Use the App Password here

# Craft the email message with headers
message = f"Subject: {subject}\n\n{body}"
# sending the mail
s.sendmail(sendersEmail, email, message)

# terminating the session
s.quit()
