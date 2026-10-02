window.CYBER_CAMPAIGNS = [
  {
    id: "bank",
    shortCode: "BK",
    name: "Bank",
    organization: "Northstar Bank",
    role: "Incident Response Associate",
    badge: "Financial Guardian",
    accent: "cyan",
    description: "Protect customer accounts, financial data, and critical banking systems.",
    levels: [
      {
        number: 1,
        difficulty: "Easy",
        title: "The Urgent Verification",
        channel: "Email report",
        time: "09:14 AM",
        brief: "A customer forwarded an email that claims their online banking access will expire in 30 minutes.",
        evidence: [
          { label: "Sender", value: "alerts@northstar-secure-help.com" },
          { label: "Subject", value: "URGENT: Verify now to keep access" },
          { label: "Link preview", value: "northstar-login.support-check.net" }
        ],
        question: "What is the safest first response?",
        choices: [
          {
            title: "Open the link to inspect it",
            detail: "Visit the page but avoid entering any information.",
            score: 0,
            verdict: "risk",
            impact: "The link could trigger a malicious download or lead to a convincing credential-stealing page.",
            lesson: "You do not need to open a suspicious link to investigate it."
          },
          {
            title: "Reply and ask if the email is legitimate",
            detail: "Respond directly to the sender for confirmation.",
            score: 10,
            verdict: "partial",
            impact: "You avoided the link, but a criminal controlling the sender address can simply claim the message is real.",
            lesson: "Verify suspicious requests through a separate, trusted communication channel."
          },
          {
            title: "Use the official app or phone number",
            detail: "Check the account independently and report the phishing message.",
            score: 20,
            verdict: "strong",
            impact: "The fraudulent message is reported without exposing the customer’s device or credentials.",
            lesson: "Navigate independently to a known website, app, or phone number."
          }
        ]
      },
      {
        number: 2,
        difficulty: "Easy",
        title: "The Unexpected Approval",
        channel: "Authentication alert",
        time: "11:38 AM",
        brief: "An employee receives three MFA approval requests while working. They did not try to sign in.",
        evidence: [
          { label: "Location", value: "Unknown device · Warsaw, Poland" },
          { label: "Requests", value: "3 attempts in 90 seconds" },
          { label: "Employee", value: "Currently in Boston" }
        ],
        question: "How should you guide the employee?",
        choices: [
          {
            title: "Approve one request to stop the alerts",
            detail: "Accept the prompt and check the account afterward.",
            score: 0,
            verdict: "risk",
            impact: "The attacker receives the second factor needed to access the employee’s account.",
            lesson: "Never approve an MFA request you did not initiate."
          },
          {
            title: "Ignore the requests",
            detail: "Wait for them to stop without taking additional action.",
            score: 10,
            verdict: "partial",
            impact: "Access is not approved, but the repeated prompts suggest the password may already be compromised.",
            lesson: "An unexpected MFA prompt is a warning that requires follow-up."
          },
          {
            title: "Deny, secure, and report",
            detail: "Reject the prompts, change the password through the official portal, and alert security.",
            score: 20,
            verdict: "strong",
            impact: "The attempt is blocked and the security team can investigate the compromised credentials.",
            lesson: "Deny the request, secure the account, and report the attempt quickly."
          }
        ]
      },
      {
        number: 3,
        difficulty: "Medium",
        title: "The Fraud Department Call",
        channel: "Phone escalation",
        time: "01:06 PM",
        brief: "A caller says they are from the bank’s fraud team and need an employee’s one-time code to reverse a suspicious transfer.",
        evidence: [
          { label: "Caller ID", value: "Northstar Bank main number" },
          { label: "Request", value: "Read back the six-digit security code" },
          { label: "Pressure", value: "Transfer completes in five minutes" }
        ],
        question: "What should the employee do?",
        choices: [
          {
            title: "Share the code because caller ID matches",
            detail: "Give the code so the transfer can be stopped quickly.",
            score: 0,
            verdict: "risk",
            impact: "Caller ID can be spoofed. The code may authorize the attacker’s own login or transaction.",
            lesson: "Passwords and one-time codes should never be shared by phone."
          },
          {
            title: "Ask for the caller’s employee ID",
            detail: "Continue the call after collecting identifying information.",
            score: 10,
            verdict: "partial",
            impact: "The employee ID could also be fabricated, so the caller’s identity remains unverified.",
            lesson: "Information supplied by the caller is not independent verification."
          },
          {
            title: "End the call and verify independently",
            detail: "Call the internal fraud team using the trusted directory and report the attempt.",
            score: 20,
            verdict: "strong",
            impact: "The social-engineering attempt fails and the real fraud team receives the evidence.",
            lesson: "Create a new connection through a trusted number when a caller requests sensitive information."
          }
        ]
      },
      {
        number: 4,
        difficulty: "Medium",
        title: "The Unusual Wire",
        channel: "Transaction monitor",
        time: "03:22 PM",
        brief: "A normally local business account initiates a $48,500 wire to a new overseas recipient minutes after a password reset.",
        evidence: [
          { label: "Device", value: "New browser · first seen today" },
          { label: "Recipient", value: "No prior transaction history" },
          { label: "Account note", value: "Primary contact changed this morning" }
        ],
        question: "What action best balances security and customer service?",
        choices: [
          {
            title: "Let the wire proceed",
            detail: "Avoid delaying a potentially legitimate customer transaction.",
            score: 0,
            verdict: "risk",
            impact: "Multiple risk signals are ignored and the funds may become difficult to recover.",
            lesson: "A cluster of unusual events should trigger stronger verification."
          },
          {
            title: "Cancel every transfer on the account",
            detail: "Block all current and future transactions indefinitely.",
            score: 10,
            verdict: "partial",
            impact: "The suspicious wire is stopped, but the response unnecessarily disrupts legitimate business activity.",
            lesson: "Contain the specific risk while following established escalation procedures."
          },
          {
            title: "Pause, verify, and escalate",
            detail: "Place a temporary hold, call a previously verified contact, and alert fraud operations.",
            score: 20,
            verdict: "strong",
            impact: "The transaction is contained while the customer’s identity and intent are verified safely.",
            lesson: "Use known contact details, not recently changed information, for high-risk verification."
          }
        ]
      },
      {
        number: 5,
        difficulty: "Hard",
        title: "Systems Held Hostage",
        channel: "Critical incident",
        time: "04:47 PM",
        brief: "Several workstations display a ransom note. Shared files are becoming unreadable and the attacker threatens to publish customer data.",
        evidence: [
          { label: "Spread", value: "Three departments affected" },
          { label: "Backups", value: "Last verified backup: 12 hours ago" },
          { label: "Deadline", value: "Payment demanded within six hours" }
        ],
        question: "What should happen first?",
        choices: [
          {
            title: "Pay immediately",
            detail: "Send the ransom before the deadline to minimize downtime.",
            score: 0,
            verdict: "risk",
            impact: "Payment does not guarantee recovery, may create legal issues, and does not stop data exposure.",
            lesson: "Ransom decisions require leadership, legal, insurance, and law-enforcement coordination."
          },
          {
            title: "Reboot devices and delete suspicious files",
            detail: "Try to restore operations as quickly as possible.",
            score: 10,
            verdict: "partial",
            impact: "Some systems may restart, but evidence can be destroyed and the malware may continue spreading.",
            lesson: "Preserve evidence and follow the response plan before attempting recovery."
          },
          {
            title: "Isolate and activate incident response",
            detail: "Separate affected systems, preserve evidence, switch to continuity procedures, and notify the response team.",
            score: 20,
            verdict: "strong",
            impact: "The spread is limited while technical, legal, and business teams coordinate recovery and notifications.",
            lesson: "Containment, evidence preservation, and coordinated recovery come before restoration."
          }
        ]
      }
    ]
  },
  {
    id: "medical",
    shortCode: "HC",
    name: "Medical Center",
    organization: "Harborview Medical Center",
    role: "Privacy & Security Coordinator",
    badge: "Healthcare Protector",
    accent: "coral",
    description: "Keep patient information secure while protecting continuity of care.",
    levels: [
      {
        number: 1,
        difficulty: "Easy",
        title: "Unexpected Lab Results",
        channel: "Email report",
        time: "08:32 AM",
        brief: "A receptionist receives an unexpected attachment labeled “Urgent Patient Lab Results.”",
        evidence: [
          { label: "Sender", value: "results@harbor-labs-docs.com" },
          { label: "Attachment", value: "Patient_Results.html" },
          { label: "Message", value: "Open before the patient arrives" }
        ],
        question: "What is the safest response?",
        choices: [
          {
            title: "Open the attachment",
            detail: "Review it quickly because a patient may be waiting.",
            score: 0,
            verdict: "risk",
            impact: "The file could steal credentials or infect a device connected to clinical systems.",
            lesson: "Urgency does not make an unexpected attachment trustworthy."
          },
          {
            title: "Forward it to another employee",
            detail: "Ask a coworker whether the document looks legitimate.",
            score: 10,
            verdict: "partial",
            impact: "The suspicious attachment now reaches another person and increases the chance it will be opened.",
            lesson: "Report suspicious messages through the approved security channel instead of forwarding them."
          },
          {
            title: "Verify through the clinical system",
            detail: "Check the known lab portal or call the lab’s trusted number, then report the email.",
            score: 20,
            verdict: "strong",
            impact: "Patient care continues through a trusted channel and the malicious email is contained.",
            lesson: "Use established clinical systems to verify unexpected medical information."
          }
        ]
      },
      {
        number: 2,
        difficulty: "Easy",
        title: "The Open Workstation",
        channel: "Walk-through observation",
        time: "10:05 AM",
        brief: "A workstation in a busy hallway is unlocked and displays a patient chart. No employee is nearby.",
        evidence: [
          { label: "Location", value: "Public-facing clinic hallway" },
          { label: "Screen", value: "Patient name, diagnosis, and medications visible" },
          { label: "Activity", value: "Visitors moving through the area" }
        ],
        question: "What should you do first?",
        choices: [
          {
            title: "Ignore it",
            detail: "The employee will probably return in a moment.",
            score: 0,
            verdict: "risk",
            impact: "Private health information remains visible and the account can be misused by anyone nearby.",
            lesson: "An unattended, unlocked clinical workstation is an active privacy risk."
          },
          {
            title: "Leave a reminder note",
            detail: "Write a note asking the employee to lock the screen next time.",
            score: 10,
            verdict: "partial",
            impact: "The reminder may help later, but the current patient information is still exposed.",
            lesson: "Secure the immediate exposure before addressing behavior."
          },
          {
            title: "Lock the screen and report the exposure",
            detail: "Protect the chart, identify the workstation owner, and follow the privacy reporting process.",
            score: 20,
            verdict: "strong",
            impact: "The immediate exposure ends and the organization can assess whether further action is needed.",
            lesson: "Lock unattended devices and document potential privacy incidents."
          }
        ]
      },
      {
        number: 3,
        difficulty: "Medium",
        title: "The Found USB Drive",
        channel: "Physical security report",
        time: "12:41 PM",
        brief: "A USB drive labeled “Patient Records — Cardiology” is found near the staff entrance.",
        evidence: [
          { label: "Owner", value: "Unknown" },
          { label: "Condition", value: "No asset tag or encryption label" },
          { label: "Location", value: "Outside a restricted entrance" }
        ],
        question: "How should the drive be handled?",
        choices: [
          {
            title: "Connect it to identify the owner",
            detail: "Open the drive on a clinic computer and inspect the files.",
            score: 0,
            verdict: "risk",
            impact: "A malicious USB can execute malware and provide an entry point into the clinical network.",
            lesson: "Never connect unknown removable media to an organizational device."
          },
          {
            title: "Test it on a personal laptop",
            detail: "Keep the hospital network safe by using a device from home.",
            score: 10,
            verdict: "partial",
            impact: "The personal device and any connected accounts are still placed at risk, and evidence may be altered.",
            lesson: "Personal equipment is not a safe analysis environment."
          },
          {
            title: "Secure and report it",
            detail: "Do not connect it; place it in a safe container and notify IT security.",
            score: 20,
            verdict: "strong",
            impact: "The device is preserved for trained personnel without exposing clinical or personal systems.",
            lesson: "Treat unknown media as potentially malicious evidence."
          }
        ]
      },
      {
        number: 4,
        difficulty: "Medium",
        title: "Telehealth From Two Cities",
        channel: "Access anomaly",
        time: "02:18 PM",
        brief: "A physician’s telehealth account is active in Boston and another country within the same ten-minute period.",
        evidence: [
          { label: "Boston session", value: "Known hospital laptop" },
          { label: "Foreign session", value: "Unknown mobile browser" },
          { label: "Account activity", value: "Three patient charts downloaded" }
        ],
        question: "What is the best containment action?",
        choices: [
          {
            title: "Assume the physician is traveling",
            detail: "Wait until the end of the day to ask about the activity.",
            score: 0,
            verdict: "risk",
            impact: "An attacker may continue accessing and downloading protected patient information.",
            lesson: "Impossible travel plus data access requires immediate investigation."
          },
          {
            title: "Change the password only",
            detail: "Reset the credential but leave active sessions and logs untouched.",
            score: 10,
            verdict: "partial",
            impact: "The password changes, but an existing session may remain active and the exposure is not assessed.",
            lesson: "Containment includes revoking sessions and reviewing activity, not only resetting a password."
          },
          {
            title: "Revoke, verify, and investigate",
            detail: "End all sessions, reset credentials, confirm with the physician, preserve logs, and notify privacy staff.",
            score: 20,
            verdict: "strong",
            impact: "Unauthorized access stops and the organization can evaluate which patient records were affected.",
            lesson: "Contain the account and preserve enough evidence to assess notification obligations."
          }
        ]
      },
      {
        number: 5,
        difficulty: "Hard",
        title: "Care Under Attack",
        channel: "Critical incident",
        time: "05:11 PM",
        brief: "Ransomware disrupts scheduling, shared files, and some electronic health record access during a busy evening shift.",
        evidence: [
          { label: "Clinical impact", value: "Emergency department remains open" },
          { label: "Systems", value: "Scheduling and records partially unavailable" },
          { label: "Network", value: "Encryption activity still detected" }
        ],
        question: "Which response protects both patients and systems?",
        choices: [
          {
            title: "Keep every system online",
            detail: "Prioritize immediate access to patient information despite the spread.",
            score: 0,
            verdict: "risk",
            impact: "Ransomware continues spreading and may remove access to even more critical services.",
            lesson: "Patient safety and cyber containment must be coordinated, not treated as opposing goals."
          },
          {
            title: "Shut down everything without warning",
            detail: "Disconnect the entire environment immediately.",
            score: 10,
            verdict: "partial",
            impact: "The spread may slow, but an uncoordinated shutdown can disrupt urgent care and medical devices.",
            lesson: "Healthcare containment must be coordinated with clinical leadership."
          },
          {
            title: "Isolate systems and activate downtime care",
            detail: "Contain affected segments, use approved clinical downtime procedures, preserve evidence, and activate incident command.",
            score: 20,
            verdict: "strong",
            impact: "Clinical teams maintain safe care while technical teams contain the attack and begin controlled recovery.",
            lesson: "A practiced continuity plan lets security action and patient care proceed together."
          }
        ]
      }
    ]
  },
  {
    id: "government",
    shortCode: "GV",
    name: "Government Agency",
    organization: "Civic Services Agency",
    role: "Cybersecurity Response Officer",
    badge: "Government Defender",
    accent: "gold",
    description: "Defend public services, employee accounts, and sensitive government records.",
    levels: [
      {
        number: 1,
        difficulty: "Easy",
        title: "The HR Password Reset",
        channel: "Employee report",
        time: "08:51 AM",
        brief: "Employees receive an email saying their payroll access will be suspended unless they reset their password today.",
        evidence: [
          { label: "Sender", value: "hr-support@civicstaff-services.org" },
          { label: "Greeting", value: "Dear Government Employee" },
          { label: "Destination", value: "A shortened web link" }
        ],
        question: "What should an employee do?",
        choices: [
          {
            title: "Use the reset link",
            detail: "Change the password before payroll access is suspended.",
            score: 0,
            verdict: "risk",
            impact: "The employee may deliver their current and new passwords directly to an attacker.",
            lesson: "Unexpected password-reset links are a common credential-phishing tactic."
          },
          {
            title: "Forward it to the whole team",
            detail: "Ask whether anyone else thinks the message is suspicious.",
            score: 10,
            verdict: "partial",
            impact: "More employees are exposed to the malicious link, even though the concern is raised.",
            lesson: "Use the designated reporting channel rather than spreading a suspicious message."
          },
          {
            title: "Check the official portal and report it",
            detail: "Navigate to the known HR system independently and send the message to security.",
            score: 20,
            verdict: "strong",
            impact: "The employee verifies account status safely and helps security warn the rest of the agency.",
            lesson: "Open official services independently instead of following unexpected links."
          }
        ]
      },
      {
        number: 2,
        difficulty: "Easy",
        title: "USB in the Parking Lot",
        channel: "Physical security report",
        time: "10:27 AM",
        brief: "An employee finds a USB drive marked “2027 Salary Plan” near the agency parking lot.",
        evidence: [
          { label: "Owner", value: "Unknown" },
          { label: "Label", value: "Designed to create curiosity" },
          { label: "Device", value: "No agency inventory tag" }
        ],
        question: "What is the correct next step?",
        choices: [
          {
            title: "Open it on a work computer",
            detail: "Find the owner by checking the documents.",
            score: 0,
            verdict: "risk",
            impact: "The USB may automatically install malware or provide access to the government network.",
            lesson: "Attackers intentionally leave attractive USB drives where employees will find them."
          },
          {
            title: "Leave it where it was found",
            detail: "Avoid touching the device and continue to work.",
            score: 10,
            verdict: "partial",
            impact: "You avoid direct exposure, but another employee may pick it up and connect it.",
            lesson: "Remove the hazard through the approved security process."
          },
          {
            title: "Turn it over to security",
            detail: "Do not connect it; document the location and give it to authorized personnel.",
            score: 20,
            verdict: "strong",
            impact: "The suspicious device is contained and can be examined in an isolated environment.",
            lesson: "Unknown media should be handled as potential evidence."
          }
        ]
      },
      {
        number: 3,
        difficulty: "Medium",
        title: "The Urgent Contractor",
        channel: "Access request",
        time: "12:09 PM",
        brief: "A contractor says a public-service deadline will be missed unless they receive administrator access immediately.",
        evidence: [
          { label: "Contract", value: "Active, but admin access is not listed" },
          { label: "Approver", value: "Manager is currently unavailable" },
          { label: "Request", value: "Full access for an unspecified period" }
        ],
        question: "How should you respond?",
        choices: [
          {
            title: "Grant access because the work is urgent",
            detail: "Provide administrator rights now and document it later.",
            score: 0,
            verdict: "risk",
            impact: "Unapproved privileged access could expose sensitive systems and violate agency policy.",
            lesson: "Urgency does not replace authorization or least-privilege controls."
          },
          {
            title: "Deny the contractor permanently",
            detail: "Reject all access without escalating or exploring an approved alternative.",
            score: 10,
            verdict: "partial",
            impact: "The immediate security risk is avoided, but a legitimate public-service task may fail unnecessarily.",
            lesson: "Secure decisions should support the mission through approved alternatives."
          },
          {
            title: "Verify and provide minimum approved access",
            detail: "Confirm the contract and sponsor, escalate approval, and time-limit only the access required.",
            score: 20,
            verdict: "strong",
            impact: "The work can proceed with traceable approval and reduced exposure to sensitive systems.",
            lesson: "Use verified authorization, least privilege, and expiration for contractor access."
          }
        ]
      },
      {
        number: 4,
        difficulty: "Medium",
        title: "Messages No One Sent",
        channel: "Account compromise",
        time: "02:46 PM",
        brief: "A department account sends a document link to hundreds of employees. The account owner says they did not send it.",
        evidence: [
          { label: "Mailbox rule", value: "New rule hides security replies" },
          { label: "Sessions", value: "Two unfamiliar devices active" },
          { label: "Recipients", value: "214 internal and external addresses" }
        ],
        question: "What response most completely contains the account?",
        choices: [
          {
            title: "Delete the sent messages",
            detail: "Remove the evidence from the Sent folder and continue monitoring.",
            score: 0,
            verdict: "risk",
            impact: "The attacker keeps access and recipients remain exposed to the malicious link.",
            lesson: "Removing visible messages does not remove an attacker."
          },
          {
            title: "Change the password",
            detail: "Reset the account credential and ask the owner to sign in again.",
            score: 10,
            verdict: "partial",
            impact: "A password reset helps, but active sessions, malicious rules, and recipient risk may remain.",
            lesson: "Compromised accounts require session, rule, log, and communication review."
          },
          {
            title: "Disable, revoke, investigate, and warn",
            detail: "Temporarily disable the account, end sessions, reset credentials, preserve logs, remove rules, and alert recipients.",
            score: 20,
            verdict: "strong",
            impact: "The attacker loses access while the agency limits secondary infections and investigates the incident.",
            lesson: "Full containment addresses access, persistence, evidence, and affected people."
          }
        ]
      },
      {
        number: 5,
        difficulty: "Hard",
        title: "Coordinated Intrusion",
        channel: "Critical incident",
        time: "04:33 PM",
        brief: "Multiple systems show unauthorized access while public-facing services slow down. Internal email may also be compromised.",
        evidence: [
          { label: "Access", value: "Privileged logins from new locations" },
          { label: "Traffic", value: "Large outbound encrypted transfers" },
          { label: "Communications", value: "Internal email integrity uncertain" }
        ],
        question: "What is the strongest coordinated response?",
        choices: [
          {
            title: "Wipe affected devices immediately",
            detail: "Erase systems before the attacker can do more damage.",
            score: 0,
            verdict: "risk",
            impact: "Critical evidence and recovery information may be destroyed while other attacker access remains active.",
            lesson: "Eradication comes after controlled containment and evidence collection."
          },
          {
            title: "Disconnect the entire agency",
            detail: "Block all services without coordinating with public-service owners.",
            score: 10,
            verdict: "partial",
            impact: "The action may limit some attacker activity but can unnecessarily interrupt essential public services.",
            lesson: "Containment should be prioritized and coordinated according to mission impact."
          },
          {
            title: "Activate the incident plan",
            detail: "Use trusted out-of-band communications, isolate affected segments, preserve evidence, protect priority services, and notify designated officials.",
            score: 20,
            verdict: "strong",
            impact: "Teams coordinate containment and public-service continuity without relying on potentially compromised channels.",
            lesson: "Major incidents require trusted communications, defined authority, evidence preservation, and service priorities."
          }
        ]
      }
    ]
  }
];
