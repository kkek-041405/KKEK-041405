
import { PortfolioHeader } from '@/components/portfolio-header';
import { PortfolioFooter } from '@/components/portfolio-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy - Chess App',
    description: 'Privacy Policy for the Chess App.',
};

export default function PrivacyPolicyPage() {
    const appName = "Chess by KKEK";
    const companyName = "K.Komal Eshwara Kumar";
    const effectiveDate = "June 21th, 2025";
    const contactEmail = "komaleshwrakumarkonatham@gmail.com";

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <PortfolioHeader />
            <main className="flex-1 py-12 md:py-16 lg:py-20">
                <div className="container mx-auto px-4">
                    <Card className="max-w-4xl mx-auto shadow-lg">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <ShieldCheck className="h-12 w-12 text-primary" />
                            </div>
                            <CardTitle className="text-3xl md:text-4xl">Privacy Policy</CardTitle>
                            <p className="text-muted-foreground pt-2">Last updated: {effectiveDate}</p>
                        </CardHeader>
                        <CardContent className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-6">
                            <p>
                                Welcome to {appName}. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
                            </p>
                            
                            <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
                            <p>We may collect information about you in a variety of ways. The information we may collect on the App includes:</p>
                            <ul>
                                <li><strong>Personal Data:</strong> Personally identifiable information, such as your username, email address, and profile picture, that you voluntarily give to us when you register with the App or when you choose to participate in various activities related to the App, such as online chat and message boards.</li>
                                <li><strong>Usage Data:</strong> Information that your device provides automatically, such as your device's Internet Protocol (IP) address, browser type, operating system, and information about your use of the App (e.g., games played, opponents, game outcomes).</li>
                                <li><strong>Device Data:</strong> Information about your mobile device, such as your mobile device ID, model, and manufacturer.</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
                            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the App to:</p>
                            <ul>
                                <li>Create and manage your account.</li>
                                <li>Enable user-to-user communications and gameplay.</li>
                                <li>Monitor and analyze usage and trends to improve your experience with the App.</li>
                                <li>Notify you of updates to the App.</li>
                                <li>Request feedback and contact you about your use of the App.</li>
                                <li>Resolve disputes and troubleshoot problems.</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-foreground">3. Disclosure of Your Information</h2>
                            <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                            <ul>
                                <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                                <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, hosting services, customer service, and marketing assistance. (e.g., Google Analytics, Firebase).</li>
                                <li><strong>Other Users:</strong> Your username, profile picture, and game activity will be visible to other users of the app to facilitate gameplay.</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-foreground">4. Security of Your Information</h2>
                            <p>
                                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                            </p>

                            <h2 className="text-2xl font-semibold text-foreground">5. Policy for Children</h2>
                            <p>
                                We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
                            </p>
                            
                            <h2 className="text-2xl font-semibold text-foreground">6. Changes to This Privacy Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                            </p>

                            <h2 className="text-2xl font-semibold text-foreground">7. Contact Us</h2>
                            <p>
                                If you have questions or comments about this Privacy Policy, please contact us at:
                            </p>
                            <p>
                                {companyName}
                                <br />
                                <Link href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</Link>
                            </p>
                            
                            <div className="p-4 bg-secondary/20 rounded-lg mt-8 text-sm">
                                <p className="font-bold text-foreground">Disclaimer:</p>
                                <p>This is a template privacy policy and is not a substitute for legal advice. You should consult with a legal professional to ensure this policy is appropriate for your specific circumstances and complies with all applicable laws.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <PortfolioFooter />
        </div>
    );
}
