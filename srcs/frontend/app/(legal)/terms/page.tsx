import type { Metadata } from "next";
import Link from "next/link";
import { ContactEmail, LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { legalInfo, teamList } from "@/components/legal/LegalInfo";

export const metadata: Metadata = {
  title: `Terms of Service · ${legalInfo.projectName}`,
  description: `The rules for using ${legalInfo.projectName} and its workspaces.`,
};

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <p>
          These terms govern your use of {legalInfo.projectName}, a web application built by {teamList},
          students at {legalInfo.school}, as part of the 42 curriculum. By logging in, you accept these
          terms. If you do not accept them, do not use the service.
        </p>
        <p>
          <strong>Publisher:</strong> the {legalInfo.projectName} project team (listed above), a group of
          students with no commercial activity. Contact: <ContactEmail />.
          <br />
          <strong>Hosting:</strong> the team’s own machines and {legalInfo.school} computers, in France.
        </p>
      </>
    ),
  },
  {
    id: "service",
    title: "The service",
    body: (
      <>
        <p>
          {legalInfo.projectName} lets HR users create, update and delete personal workspaces for
          employees. Each workspace is an isolated Linux environment with the tools for the employee’s
          job. Employees log in and use their workspace through a terminal in their web browser. Several
          users can use the service at the same time.
        </p>
        <p>
          The service is free. It is a development and evaluation project: features may change without
          notice, and the service may be stopped, reset or deleted at any time, in particular at the end
          of the project.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Your account",
    body: (
      <ul>
        <li>Employee accounts are created by an HR user.</li>
        <li>
          Keep your password secret and do not share your account. You are responsible for what is done
          with it.
        </li>
        <li>
          If you think someone else has used your account, tell us right away at <ContactEmail />.
        </li>
        <li>Information you add to your profile must be accurate and must not impersonate anyone.</li>
      </ul>
    ),
  },
  {
    id: "hr",
    title: "Additional rules for HR users",
    body: (
      <ul>
        <li>
          Only create accounts and workspaces for people who need them, with accurate information.
        </li>
        <li>Use employees’ information only to manage their accounts and workspaces.</li>
        <li>
          When an employee leaves, delete their account and workspace. Tell them beforehand, so they can
          ask for a copy of their files.
        </li>
        <li>During development and evaluation, use test data rather than real people’s information.</li>
      </ul>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use of workspaces",
    body: (
      <>
        <p>
          Workspaces run on shared machines used by several people at once. To keep the service safe and
          usable for everyone, you must not:
        </p>
        <ul>
          <li>
            try to leave your workspace, gain administrator rights, or reach the host machine, the database,
            other workspaces or any other part of the service;
          </li>
          <li>try to access another user’s account, workspace or data;</li>
          <li>
            overload the machine, for example with fork bombs, cryptocurrency mining, filling the disk, or
            jobs that slow down other users;
          </li>
          <li>use your workspace to attack, scan or send spam to other systems;</li>
          <li>store or share illegal content, malware, or content that infringes the rights of others.</li>
        </ul>
        <p>
          We may limit the resources available to each workspace (processor, memory, disk, number of
          processes) to protect other users. If you find a security problem, please tell us instead of
          using it.
        </p>
      </>
    ),
  },
  {
    id: "content",
    title: "Your files",
    body: (
      <ul>
        <li>
          Files you create in your workspace remain yours. We claim no rights over them, and you are
          responsible for what you store and run.
        </li>
        <li>
          <strong>There are no backups.</strong> Files can be lost because of a bug, a reset or the end of
          the project. Keep your own copy of anything important.
        </li>
        <li>
          When your workspace or account is deleted, its files are permanently deleted. If you need a copy,
          ask us before that happens.
        </li>
      </ul>
    ),
  },
  {
    id: "suspension",
    title: "Suspension and deletion",
    body: (
      <ul>
        <li>
          The team, or an HR user, may suspend or delete an account that breaks these terms or puts the
          service or other users at risk. When possible, we will warn you first.
        </li>
        <li>
          You can ask us to delete your account at any time by writing to <ContactEmail />.
        </li>
      </ul>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: (
      <p>
        The code, design and documentation of {legalInfo.projectName} are the work of the project team.
        The service is built with open-source software, including Next.js, FastAPI, PostgreSQL, nginx,
        Docker and xterm.js, and the tools inside workspaces come from Debian packages. Each of these
        remains under its own licence.
      </p>
    ),
  },
  {
    id: "liability",
    title: "No warranty and limitation of liability",
    body: (
      <>
        <p>
          {legalInfo.projectName} is provided free of charge, as is, for educational purposes. We do not
          guarantee that it will always be available, free of errors or secure.
        </p>
        <p>
          To the extent permitted by law, the team is not liable for any loss of data or any indirect
          damage resulting from the use of the service. Nothing in these terms limits any liability that
          cannot be limited under French law.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Personal data",
    body: (
      <p>
        How we handle your personal data is explained in our <Link href="/privacy">Privacy Policy</Link>.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        If we change these terms, we will update the date at the top of this page and tell users about
        important changes in the application. If you keep using the service after a change, you accept
        the new terms.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by French law. If you have a disagreement with us, please contact us first
        so we can try to resolve it amicably. Otherwise, the competent French courts will have
        jurisdiction.
      </p>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro={
        <p>
          These terms set out the rules for using {legalInfo.projectName}: what the service offers, what
          you may and may not do with your account and workspace, and the limits of our responsibility.
        </p>
      }
      sections={sections}
      related={{ href: "/privacy", label: "Privacy Policy" }}
    />
  );
}
