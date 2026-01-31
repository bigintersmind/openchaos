"use client";

import { useState, useEffect } from "react";

interface GuestbookEntry {
  name: string;
  date: string;
  message: string;
}

const DEFAULT_ENTRIES: GuestbookEntry[] = [
  {
    name: "xXCoolDude99Xx",
    date: "12/25/1999",
    message: "Y2K is coming!!! Stock up on canned food and batteries! The government doesn't want you to know! Visit my site: geocities.com/area51/bunker/xXCoolDude99Xx for the TRUTH!!!"
  },
  {
    name: "SkaterGrrl4Life",
    date: "11/18/1999",
    message: "SEND THIS TO 10 PPL OR YOU WILL HAVE BAD LUCK FOR 7 YEARS!!! Britney is my queen btw. ^_^"
  },
  {
    name: "NetSurfer2000",
    date: "10/31/1999",
    message: "FREE MONEY ONLINE!!! Work from home!!! Click here -> www.priceiswrongbitch.net <- I made $5000 last week!!! This really works!!!"
  },
  {
    name: "TechWiz98",
    date: "09/15/1999",
    message: "WHOA this is like THE MATRIX! What if WE'RE in the matrix right now?!?! Email me: TechWiz98@hotmail.com to discuss THEORIES!"
  },
  {
    name: "CyberChick777",
    date: "08/08/1999",
    message: "OpenChaos 4 ever <3 <3 <3 Also my homepage is angelfire.com/cybercutie777 plz visit & sign MY guestbook too!!!! xoxo *~*~*"
  }
];

export function Guestbook() {
  const [isOpen, setIsOpen] = useState(false);
  const [userEntries, setUserEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("guestbook-entries");
    if (stored) {
      try {
        setUserEntries(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load guestbook entries", e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      alert("Please fill out both fields!");
      return;
    }

    const newEntry: GuestbookEntry = {
      name: name.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }),
      message: message.trim()
    };

    const updated = [newEntry, ...userEntries];
    setUserEntries(updated);
    localStorage.setItem("guestbook-entries", JSON.stringify(updated));

    setName("");
    setMessage("");
    setShowForm(false);
    alert("Thanks for signing the guestbook!");
  };

  const allEntries = [...userEntries, ...DEFAULT_ENTRIES];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="guestbook-button"
        style={{ width: '100%', margin: 0 }}
      >
        Sign Guestbook
      </button>

      {isOpen && (
        <div className="guestbook-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="guestbook-modal" onClick={(e) => e.stopPropagation()}>
            <div className="guestbook-modal-header">
              <span className="guestbook-modal-header-text">
                Guestbook
              </span>
            </div>
            <div className="guestbook-modal-subheader">
              <span className="guestbook-modal-subheader-text">
                Thanks for visiting! See what other visitors have said.
              </span>
            </div>
            <div className="guestbook-modal-content">
              {!showForm ? (
                <div className="guestbook-entries-container">
                  {allEntries.map((entry, index) => (
                    <div key={index} className="guestbook-entry">
                      <div className="guestbook-entry-header">
                        <span className="guestbook-entry-name">
                          {entry.name}
                        </span>
                        <span className="guestbook-entry-date">
                          {entry.date}
                        </span>
                      </div>
                      <div className="guestbook-entry-message">
                        {entry.message}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="guestbook-form">
                  <div className="guestbook-form-title">Sign the Guestbook</div>
                  <form onSubmit={handleSubmit}>
                    <div className="guestbook-form-field">
                      <label className="guestbook-form-label">Your Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., @yourGitHubUsername"
                        maxLength={50}
                        className="guestbook-form-input"
                      />
                    </div>
                    <div className="guestbook-form-field">
                      <label className="guestbook-form-label">Message</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Leave your mark on the information superhighway!"
                        maxLength={500}
                        rows={5}
                        className="guestbook-form-textarea"
                      />
                    </div>
                    <div className="guestbook-form-actions">
                      <button type="submit" className="guestbook-submit-button">
                        Sign It
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="guestbook-cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            <div className="guestbook-modal-footer">
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="guestbook-sign-button"
                >
                  Sign Guestbook
                </button>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowForm(false);
                }}
                className="guestbook-close-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
