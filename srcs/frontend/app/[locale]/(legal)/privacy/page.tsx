import type { Metadata } from "next";
import { ContactEmail, LegalPage, TableWrap, type LegalSection } from "@/components/legal/LegalPage";
import { legalInfo, teamList } from "@/components/legal/LegalInfo";

export const metadata: Metadata = {
  title: `Privacy Policy · ${legalInfo.projectName}`,
  description: `How ${legalInfo.projectName} collects, uses and protects your personal data.`,
};

const sections: LegalSection[] = [
  {
    id: "controller",
    title: "Who is responsible for your data",
    body: (
      <>
        <p>
          The data controller is the {legalInfo.projectName} project team: {teamList}, students at{" "}
          {legalInfo.school}, France. The team is a group of students, not a company.
        </p>
        <p>
          For any question about your data, or to use your rights, write to <ContactEmail />.
        </p>
      </>
    ),
  },
  {
    id: "service",
    title: "What the service does",
    body: (
      <p>
        {legalInfo.projectName} helps a company handle hiring, promotions and departures. HR users
        create a personal workspace for each employee: an isolated Linux environment with the tools
        needed for their job (for example software engineer, accountant, data analyst, DevOps engineer
        or technical writer). Employees log in and use their workspace through a terminal in their web
        browser. To do this, the service needs to process some personal data, described below.
      </p>
    ),
  },
  {
    id: "data",
    title: "What data we collect",
    body: (
      <>
        <h3>Account and profile</h3>
        <TableWrap>
          <table>
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Why it is needed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Username</td>
                <td>To log in and identify your account.</td>
              </tr>
              <tr>
                <td>First name, last name, display name</td>
                <td>To show who you are to HR users and in the interface.</td>
              </tr>
              <tr>
                <td>Email address</td>
                <td>To identify you and contact you about your account.</td>
              </tr>
              <tr>
                <td>Password</td>
                <td>To log in. It is stored only as a hash: nobody, including the team, can read it.</td>
              </tr>
              <tr>
                <td>Profile picture (optional)</td>
                <td>Shown in the interface, only if one is added to your account.</td>
              </tr>
              <tr>
                <td>Job (optional)</td>
                <td>Your job title. It decides which tools are installed in your workspace.</td>
              </tr>
              <tr>
                <td>Account type</td>
                <td>For example HR or employee. It decides what you are allowed to do in the app.</td>
              </tr>
              <tr>
                <td>Account creation date</td>
                <td>To manage accounts over time (hiring, promotion, departure).</td>
              </tr>
            </tbody>
          </table>
        </TableWrap>
        <p>
          This information is entered by the HR user who creates your account, or by you when you edit
          your profile.
        </p>

        <h3>Your workspace</h3>
        <p>
          Files you create or change in your workspace are stored on a persistent volume, so they are
          still there the next time you log in. As on any Linux system, your shell also saves the commands
          you type in a history file (<code>~/.bash_history</code>) inside your workspace. You can delete
          that file at any time.
        </p>
        <p>
          We do not record what you type in the terminal or what it displays. We only log when a terminal
          session starts and ends.
        </p>

        <h3>Technical data</h3>
        <p>
          When you use the site, our web server and application keep technical logs: your IP address, the
          date and time, the page or address requested and your browser type. For the terminal, they record
          the start and end of each session, with your account and workspace. These logs are only used to
          keep the service working and secure.
        </p>

        <h3>What we do not collect</h3>
        <p>
          No analytics, no advertising, no tracking cookies and no third-party services. We do not sell,
          rent or share your data with anyone.
        </p>
      </>
    ),
  },
  {
    id: "purposes",
    title: "Why we use your data",
    body: (
      <>
        <p>
          Under the General Data Protection Regulation (GDPR), every use of personal data needs a legal
          basis. Ours are:
        </p>
        <TableWrap>
          <table>
            <thead>
              <tr>
                <th scope="col">Purpose</th>
                <th scope="col">Legal basis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Giving you an account, letting you log in and providing your workspace</td>
                <td>Providing the service you use (GDPR art. 6(1)(b))</td>
              </tr>
              <tr>
                <td>Letting HR users manage employees’ accounts and workspaces</td>
                <td>
                  Our legitimate interest in running the hiring, promotion and departure features that
                  are the purpose of the app (GDPR art. 6(1)(f))
                </td>
              </tr>
              <tr>
                <td>Keeping the service secure and fixing problems, using technical logs</td>
                <td>Our legitimate interest in a secure and reliable service (GDPR art. 6(1)(f))</td>
              </tr>
              <tr>
                <td>Showing the project during its evaluation at 42</td>
                <td>Our legitimate interest in completing our school curriculum (GDPR art. 6(1)(f))</td>
              </tr>
            </tbody>
          </table>
        </TableWrap>
        <p>We never use your data for advertising, profiling or automated decisions about you.</p>
      </>
    ),
  },
  {
    id: "access",
    title: "Who can see your data",
    body: (
      <>
        <ul>
          <li>
            <strong>You</strong> can see your profile and everything in your workspace.
          </li>
          <li>
            <strong>HR users</strong> can see employees’ profile information and create, change or delete
            their accounts and workspaces. They cannot open your terminal.
          </li>
          <li>
            <strong>The project team</strong> administers the servers, so it can technically access all
            data, including workspace files. We only do so when needed to run, fix or evaluate the
            project.
          </li>
          <li>
            <strong>Evaluators</strong>: during peer evaluation at 42, other students and school staff may
            see the running application and the data in it. This is another reason to use test data.
          </li>
        </ul>
        <p>
          Nobody else has access. Your data stays on machines located in France and is never transferred
          outside the European Union.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <ul>
        <li>
          <strong>Account and profile:</strong> as long as your account exists. They are deleted when the
          account is deleted, for example when an HR user records your departure.
        </li>
        <li>
          <strong>Workspace files:</strong> until your workspace is deleted. Its storage volume is deleted
          with it, so the files cannot be recovered afterwards.
        </li>
        <li>
          <strong>Technical logs:</strong> kept inside the service’s containers, and erased when those
          containers are removed.
        </li>
        <li>
          <strong>End of the project:</strong> once the project has been evaluated, the database, all
          workspaces and all logs are deleted.
        </li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <p>
        We use one cookie, which keeps you logged in. It is strictly necessary for the service to work,
        so under the rules of the CNIL (the French data protection authority) it does not require your
        consent, and there is no cookie banner. It is removed when you log out or when it expires. We use
        no analytics or advertising cookies.
      </p>
    ),
  },
  {
    id: "security",
    title: "How we protect your data",
    body: (
      <>
        <ul>
          <li>All connections to the site are encrypted with HTTPS.</li>
          <li>Passwords are stored as hashes, never in plain text.</li>
          <li>
            Each workspace runs in its own isolated container, under an account without administrator
            rights, so one user cannot reach another user’s files.
          </li>
          <li>Every connection to a workspace terminal is checked against your account.</li>
        </ul>
        <p>
          No system is perfectly secure. If a security incident affects your data, we will tell you as
          soon as possible.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>
          Under the GDPR and the French Data Protection Act (loi Informatique et Libertés), you have the
          right to:
        </p>
        <ul>
          <li>access the personal data we hold about you and get a copy of it;</li>
          <li>have inaccurate data corrected;</li>
          <li>have your data deleted;</li>
          <li>restrict how we use your data, or object to it;</li>
          <li>receive your data in a common, machine-readable format (data portability);</li>
          <li>give instructions about what happens to your data after your death.</li>
        </ul>
        <p>
          To use any of these rights, email <ContactEmail />. We will answer within one month and may ask
          you to confirm your identity first. If you need a copy of your workspace files, ask before your
          account is deleted.
        </p>
        <p>
          If you think we have not respected your rights, you can file a complaint with the CNIL (
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            www.cnil.fr
          </a>
          ).
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        If we change this policy, we will update the date at the top of this page. For important changes,
        we will also tell users in the application.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <p>
          This policy explains what personal data {legalInfo.projectName} collects, why, who can see it,
          how long it is kept and what your rights are.
        </p>
      }
      sections={sections}
      related={{ href: "/legal/terms", label: "Terms of Service" }}
    />
  );
}
