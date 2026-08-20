import type { NextPage } from 'next'
import React from 'react';
import Head from 'next/head';

import { Typography, Alert, Divider, Anchor } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
const { Text, Title, Paragraph } = Typography;

const EFFECTIVE_DATE = 'August 19, 2026';

const sections = [
    { key: 'collect', title: '1. Information We Collect' },
    { key: 'use', title: '2. How We Use Information' },
    { key: 'public', title: '3. Public Display' },
    { key: 'others', title: '4. Submissions About Other People' },
    { key: 'removal', title: '5. Removing a Name' },
    { key: 'retention', title: '6. Data Retention' },
    { key: 'security', title: '7. Security' },
    { key: 'children', title: "8. Children's Privacy" },
    { key: 'dnt', title: '9. Do Not Track' },
    { key: 'thirdparties', title: '10. Third Parties' },
    { key: 'changes', title: '11. Changes to This Policy' },
    { key: 'contact', title: '12. Contact' },
];

type SectionProps = {
    id: string;
    title: string;
    children: React.ReactNode;
};

const Section = ({ id, title, children }: SectionProps) => (
    <section id={id} style={{ scrollMarginTop: 16 }}>
        <Title level={3} style={{ marginTop: 32 }}>{title}</Title>
        {children}
    </section>
);

const Privacy: NextPage = () => {
    return <div className="Content">
        <Head>
            <title>Privacy Policy - Rice O-Week Tree</title>
            <meta
                name="description"
                content="How oweek.org collects, displays, and removes names submitted to the Rice O-Week family tree."
                key="desc"
            />
        </Head>

        <article className="Prose">
            <Title style={{ marginBottom: 0 }}>Privacy Policy</Title>
            <Text type="secondary">Effective Date: {EFFECTIVE_DATE}</Text>

            <Paragraph style={{ marginTop: 24 }}>
                oweek.org (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is a personal, non-commercial
                project operated from the United States. This policy explains what we collect, how it is
                used, and how you can have a name removed.
            </Paragraph>

            <Alert
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                message="Every name submitted to this website is publicly visible and searchable by anyone on the internet."
                style={{ marginTop: 24, marginBottom: 24 }}
            />

            <Anchor affix={false} targetOffset={16}>
                {sections.map(({ key, title }) =>
                    <Anchor.Link key={key} href={`#${key}`} title={title} />
                )}
            </Anchor>

            <Divider />

            <Section id="collect" title="1. Information We Collect">
                <Paragraph>
                    <Text strong>Information you submit.</Text> Names submitted as part of a family roster.
                    Submissions do not require an account, and we do not ask for email addresses, phone
                    numbers, or other contact information as part of a submission.
                </Paragraph>
                <Paragraph>
                    <Text strong>Information collected automatically.</Text> Our hosting provider records
                    standard technical information when you visit, including your IP address, browser type
                    and version, the pages you request, and the date and time of each request. We also use
                    Vercel Web Analytics and Vercel Speed Insights to count page views and measure page load
                    performance. These do not use cookies and do not track you across other websites.
                </Paragraph>
                <Paragraph>
                    <Text strong>Information you send us.</Text> If you email us, we receive your email
                    address and whatever you include in your message.
                </Paragraph>
                <Paragraph>
                    We do not sell any of this information, and we do not use it for advertising.
                </Paragraph>
            </Section>

            <Section id="use" title="2. How We Use Information">
                <Paragraph>
                    Submitted names are used to display rosters publicly on this site and to let visitors
                    search them. Automatically collected technical information is used to operate the site,
                    diagnose errors, and address abuse. Email correspondence is used to respond to you.
                </Paragraph>
            </Section>

            <Section id="public" title="3. Public Display">
                <Paragraph>
                    All submitted names are shown publicly and are searchable. They may be viewed, copied,
                    cached, or indexed by search engines and other third parties outside our control. Once a
                    name has been public, we cannot retrieve copies that others have already made.
                </Paragraph>
                <Paragraph>
                    Please do not submit sensitive or confidential information through this site.
                </Paragraph>
            </Section>

            <Section id="others" title="4. Submissions About Other People">
                <Paragraph>
                    This site allows users to submit rosters that include names other than their own. If you
                    submit someone else&apos;s name, you are responsible for having their permission to do so.
                </Paragraph>
                <Paragraph>
                    We recognize that a person whose name appears here may not have submitted it and may not
                    want it displayed. <a href="#removal">Section 5</a> applies to anyone named on this site,
                    whether or not they submitted the name themselves.
                </Paragraph>
            </Section>

            <Section id="removal" title="5. Removing a Name">
                <Paragraph>
                    <Text strong>Self-service removal.</Text> You may remove your own name at any time by
                    resubmitting your family&apos;s roster without it. No account or request is required, and
                    the change takes effect immediately.
                </Paragraph>
                <Paragraph>
                    Because any visitor may submit a roster, a name removed this way can be re-added by a
                    later submission.
                </Paragraph>
                <Paragraph>
                    <Text strong>Permanent removal.</Text> To have a name kept off the site for good, email us
                    at <a href="mailto:contact@oweek.org">contact@oweek.org</a>. We will remove the name and
                    add it to a suppression list that blocks it from future submissions. We will do this
                    within 30 days, and typically within a few days of receiving your request.
                </Paragraph>
                <Paragraph>
                    We may ask a follow-up question to confirm a request is genuine, but we will not require
                    you to prove your identity with documents.
                </Paragraph>
            </Section>

            <Section id="retention" title="6. Data Retention">
                <Paragraph>
                    Submitted names are retained for as long as they appear in a current roster. Names on the
                    suppression list are retained in that list indefinitely, since that is what keeps them
                    from reappearing. Server logs are retained by our hosting provider under its standard
                    retention period.
                </Paragraph>
            </Section>

            <Section id="security" title="7. Security">
                <Paragraph>
                    Submitted names are intentionally public and are not protected by any access control.
                    Non-public information &mdash; server logs and email correspondence &mdash; is held by our
                    hosting and email providers under their own security practices. This is a small personal
                    project and we do not represent that our security measures meet any particular standard.
                </Paragraph>
            </Section>

            <Section id="children" title="8. Children's Privacy">
                <Paragraph>
                    This site is directed at university students and is not intended for children under 13.
                    We do not knowingly collect personal information from children under 13. If you believe a
                    name belonging to a child under 13 has been submitted, contact us
                    at <a href="mailto:contact@oweek.org">contact@oweek.org</a> and we will remove it.
                </Paragraph>
            </Section>

            <Section id="dnt" title="9. Do Not Track">
                <Paragraph>
                    We do not respond to Do Not Track browser signals, because we do not track visitors across
                    other websites.
                </Paragraph>
            </Section>

            <Section id="thirdparties" title="10. Third Parties">
                <Paragraph>
                    This site is hosted on <a href="https://vercel.com" target="_blank" rel="noreferrer noopener">Vercel</a>,
                    which also provides the database that stores submitted rosters and the analytics described
                    in Section 1. Email sent to contact@oweek.org is handled by our email provider. These
                    providers process information on our behalf as described above. We do not share submitted
                    names or technical information with anyone else, except where required by law.
                </Paragraph>
            </Section>

            <Section id="changes" title="11. Changes to This Policy">
                <Paragraph>
                    We may update this policy. Updates will be posted on this page with a revised effective
                    date.
                </Paragraph>
            </Section>

            <Section id="contact" title="12. Contact">
                <Paragraph>
                    Questions or removal requests: <Text strong><a href="mailto:contact@oweek.org">contact@oweek.org</a></Text>
                </Paragraph>
            </Section>
        </article>
    </div>;
}

export default Privacy
