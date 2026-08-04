import dotenv from 'dotenv';
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

export interface PolicyGenerationInput {
  framework: 'SOC 2' | 'HIPAA' | 'GDPR' | 'ISO 27001';
  companyName: string;
  industry: string;
  cloudProvider: string;
  dataTypes: string[];
  teamSize: string;
  customRequirements?: string;
}

// Intent types for copilot routing
type CopilotIntent =
  | 'SOC2'
  | 'HIPAA'
  | 'GDPR'
  | 'Controls'
  | 'Evidence'
  | 'Checklist'
  | 'Billing'
  | 'ProductHowTo'
  | 'General';

interface UserContext {
  policies: any[];
  controls: any[];
  checklists: any[];
  score: any | null;
}

export class AIService {
  /**
   * Generate an enterprise compliance policy tailored to startup parameters
   */
  static async generatePolicy(input: PolicyGenerationInput): Promise<{ title: string; category: string; content: string; tags: string[] }> {
    if (OPENROUTER_API_KEY) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://aicompliancelite.com',
            'X-Title': 'AI Compliance Lite Platform'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.1-70b-instruct',
            messages: [
              {
                role: 'system',
                content: `You are an expert Big-4 SOC 2, HIPAA, and GDPR auditor and compliance engineer. Output strict JSON with properties: "title", "category", "content" (in rich markdown format), and "tags" (array of strings).`
              },
              {
                role: 'user',
                content: `Generate a complete, audit-ready ${input.framework} policy for ${input.companyName}, operating in ${input.industry} hosted on ${input.cloudProvider} with ${input.teamSize} team members. Handling data: ${input.dataTypes.join(', ')}.`
              }
            ]
          })
        });

        const data = await response.json();
        const contentRaw = data.choices?.[0]?.message?.content;
        if (contentRaw) {
          const sanitized = contentRaw
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/```\s*$/i, '')
            .trim();
          try {
            const parsed = JSON.parse(sanitized);
            if (parsed.title && parsed.content) return parsed;
          } catch (parseErr) {
            console.warn('[AI Service] Failed to parse LLM JSON response, using synthesizer fallback.');
          }
        }
      } catch (err) {
        console.warn('[AI Service] OpenRouter API call failed or timed out. Falling back to Compliance Synthesizer.');
      }
    }

    return this.synthesizePolicy(input);
  }

  private static synthesizePolicy(input: PolicyGenerationInput) {
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    if (input.framework === 'SOC 2') {
      return {
        title: `${input.companyName} - Information Security & Access Control Policy (SOC 2 CC6.1)`,
        category: 'Information Security & Logical Access',
        tags: ['SOC 2', 'Access Control', 'CC6.1', 'Encryption', 'Multi-Factor Auth'],
        content: `# ${input.companyName} - Information Security Policy
**Document Ref:** POL-SOC2-SEC-001  
**Framework Target:** SOC 2 Type II (Trust Services Criteria CC6.1, CC6.2, CC6.3, CC6.6)  
**Effective Date:** ${dateStr}  
**Version:** 1.0 (Audit Ready)  
**Owner:** Head of Engineering / CISO  

---

### 1. Purpose & Scope
This policy defines mandatory security standards and controls governing access, infrastructure management, and data protection across **${input.companyName}**. This applies to all employees, contractors, codebases, and infrastructure deployed on **${input.cloudProvider}**.

### 2. Industry & Data Classification (${input.industry})
**${input.companyName}** processes sensitive enterprise information including: ${input.dataTypes.join(', ')}.
- **Confidential Data:** Must be encrypted in transit using TLS 1.3 and at rest using AES-256 via ${input.cloudProvider} KMS.
- **Access Principle:** Principle of Least Privilege (PoLP) and Role-Based Access Control (RBAC) enforced via Clerk & Supabase RLS.

### 3. Mandated Technical Controls

#### 3.1 Logical Access & Identity Management (CC6.1)
1. **Multi-Factor Authentication (MFA):** Mandatory 100% MFA enforcement on all ${input.cloudProvider}, GitHub, Clerk, and Supabase console logins.
2. **Password Standards:** Minimum 16 characters, enforced via identity provider password complexity policies.
3. **Deprovisioning SLA:** Access revocation must occur within 24 hours of employee or contractor termination.

#### 3.2 Infrastructure & Cloud Security (${input.cloudProvider})
1. **Network Segmentation:** Cloud environments must isolate Production, Staging, and Development resources into separate VPCs/workspaces.
2. **Encryption Standards:**
   - **In-Transit:** HTTPS / TLS 1.3 forced on all APIs.
   - **At-Rest:** Encryption via AES-256 for PostgreSQL databases (Supabase), S3 buckets, and persistent storage volumes.
3. **Secret Management:** Hardcoded API keys, DB credentials, or secrets in git repositories are strictly prohibited.

#### 3.3 Change Management & Code Quality (CC8.1)
1. All application code changes require mandatory peer code review via Pull Request before merging to \`main\`.
2. Direct commits to production branches are locked and prohibited.
3. Automated CI/CD security scanning must pass prior to deployment.

### 4. Incident Response & Monitoring
1. Continuous centralized logging via Winston/Datadog with immutable 90-day retention.
2. High-severity alerts dispatched immediately to Security Response Slack channel.

---
**Approved By:**  
Executive Leadership Team, ${input.companyName}`
      };
    } else if (input.framework === 'HIPAA') {
      return {
        title: `${input.companyName} - HIPAA Security Safeguards & Business Associate Policy`,
        category: 'HIPAA Technical & Administrative Safeguards',
        tags: ['HIPAA', 'ePHI', 'BAA', '164.312', 'Encryption'],
        content: `# ${input.companyName} - HIPAA Security Safeguards Policy
**Document Ref:** POL-HIPAA-001  
**Compliance Mandate:** HIPAA Security Rule 45 CFR § 164.308, § 164.312  
**Effective Date:** ${dateStr}  
**Organization:** ${input.companyName} (${input.industry})  

---

### 1. Overview & ePHI Definition
This policy governs all electronic Protected Health Information (ePHI) created, received, maintained, or transmitted by **${input.companyName}** on **${input.cloudProvider}**. 

Data Covered: ${input.dataTypes.join(', ')}.

### 2. Business Associate Agreements (BAAs) (§ 164.502(e))
1. **Vendor Verification:** Prior to storing ePHI on third-party sub-processors (${input.cloudProvider}, Supabase, Clerk), an executed Business Associate Agreement (BAA) must be on file.
2. **Sub-Processor Inventory:** Maintain an audit-ready inventory of all vendors handling health data.

### 3. Technical Safeguards (§ 164.312)
1. **Access Control (§ 164.312(a)(1)):** Unique user identification for every staff member. Emergency access procedures documented.
2. **Automatic Logoff (§ 164.312(a)(2)(iii)):** Session timeouts enforced after 15 minutes of inactivity on all internal consoles.
3. **ePHI Encryption (§ 164.312(e)(1)):** End-to-end encryption for ePHI in transit (TLS 1.3) and at rest (AES-256).

### 4. Audit Controls (§ 164.312(b))
Immutable audit logging enabled across API layer (Winston loggers) and Supabase database. Logs track user ID, timestamp, IP address, and resource accessed.`
      };
    } else {
      return {
        title: `${input.companyName} - GDPR Data Protection & Subject Rights Policy`,
        category: 'Data Protection & Privacy',
        tags: ['GDPR', 'DPA', 'Subject Access Request', 'Article 32', 'Data Minimization'],
        content: `# ${input.companyName} - GDPR Privacy & Data Rights Policy
**Document Ref:** POL-GDPR-001  
**Regulation Target:** EU General Data Protection Regulation (Regulation 2016/679)  
**Effective Date:** ${dateStr}  
**Organization:** ${input.companyName}  

---

### 1. Data Minimization & Legal Basis (Article 5 & 6)
**${input.companyName}** processes personal data strictly under lawful bases (Consent, Performance of Contract, Legitimate Interest). Data elements collected (${input.dataTypes.join(', ')}) are kept minimal and necessary.

### 2. Data Subject Rights Protocol (Articles 15 - 22)
1. **Right of Access & Portability:** Data export requests must be processed in structured JSON within 30 days.
2. **Right to Erasure ("Right to be Forgotten"):** Upon receiving a deletion request, user data across Supabase and sub-processors must be permanently purged within 30 calendar days.
3. **Data Protection Impact Assessment (DPIA):** Conducted annually or prior to launching high-risk feature processing.`
      };
    }
  }

  /**
   * Classify question into one of 8 intent types
   */
  private static classifyIntent(question: string): CopilotIntent {
    const q = question.toLowerCase();
    if (q.includes('soc 2') || q.includes('soc2') || q.includes('cc6') || q.includes('cc7') || q.includes('cc8') || q.includes('trust services')) return 'SOC2';
    if (q.includes('hipaa') || q.includes('baa') || q.includes('ephi') || q.includes('164.312') || q.includes('phi')) return 'HIPAA';
    if (q.includes('gdpr') || q.includes('data subject') || q.includes('right to be forgotten') || q.includes('article 32') || q.includes('dpa')) return 'GDPR';
    if (q.includes('control') || q.includes('evidence') && q.includes('attach') || q.includes('upload') && q.includes('proof')) return 'Controls';
    if (q.includes('evidence') || q.includes('screenshot') || q.includes('proof') || q.includes('attachment')) return 'Evidence';
    if (q.includes('checklist') || q.includes('audit prep') || q.includes('readiness') || q.includes('checklist item')) return 'Checklist';
    if (q.includes('billing') || q.includes('pricing') || q.includes('plan') || q.includes('subscription') || q.includes('payment') || q.includes('$299')) return 'Billing';
    if (q.includes('how to') || q.includes('how do i') || q.includes('getting started') || q.includes('walkthrough') || q.includes('tutorial') || q.includes('arky')) return 'ProductHowTo';
    return 'General';
  }

  /**
   * Build a context string from user's DB data for grounding the AI answer
   */
  private static buildContextString(userCtx: UserContext): string {
    const parts: string[] = [];

    if (userCtx.policies.length > 0) {
      parts.push(`USER POLICIES (${userCtx.policies.length} total):\n` +
        userCtx.policies.map(p => `- [${p.framework}] "${p.title}" — Status: ${p.status}`).join('\n'));
    } else {
      parts.push('USER POLICIES: None yet generated.');
    }

    if (userCtx.controls.length > 0) {
      parts.push(`USER CONTROLS (${userCtx.controls.length} total):\n` +
        userCtx.controls.map(c => `- ${c.code}: "${c.title}" [${c.framework}] — Status: ${c.status}${c.evidence_url ? ' — Evidence: Attached' : ' — Evidence: Missing'}`).join('\n'));
    } else {
      parts.push('USER CONTROLS: None yet loaded.');
    }

    if (userCtx.score) {
      parts.push(`COMPLIANCE SCORE: ${userCtx.score.overall_score}% — Risk Level: ${userCtx.score.risk_level}`);
    }

    return parts.join('\n\n');
  }

  /**
   * AI Assistant Chatbot Q&A response generator with intent routing + DB retrieval
   */
  static async answerQuestion(
    question: string,
    userCtx: UserContext = { policies: [], controls: [], checklists: [], score: null },
    extraContext?: any
  ): Promise<{ answer: string; relatedControls: string[]; actionItems: string[] }> {
    const intent = this.classifyIntent(question);
    const contextString = this.buildContextString(userCtx);

    // Determine related controls from user's actual data
    const relatedControls = userCtx.controls
      .filter(c => {
        if (intent === 'SOC2') return c.framework === 'SOC 2';
        if (intent === 'HIPAA') return c.framework === 'HIPAA';
        if (intent === 'GDPR') return c.framework === 'GDPR';
        return true; // General: return all
      })
      .slice(0, 4)
      .map(c => `${c.code} — ${c.title}`);

    // If we have no DB data and can't do retrieval, say so clearly
    const hasNoData = userCtx.policies.length === 0 && userCtx.controls.length === 0;

    // Try OpenRouter with full context if available
    if (OPENROUTER_API_KEY) {
      try {
        const systemPrompt = `You are an expert SOC 2, HIPAA, and GDPR compliance advisor for a SaaS startup. 
You have access to the user's actual compliance data shown below. 
Always reference their specific policies and controls by name when answering. 
Never claim the user is certified or guaranteed to be compliant.
Structure every answer exactly as:
1. **Direct Answer** (1-3 sentences referencing their data)
2. **Why** (reference the framework rule and the user's specific records)
3. **Next Steps** (1-3 bullets)
4. **Related Controls** (list codes and titles from their controls above)

USER DATA:
${contextString}`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://aicompliancelite.com',
            'X-Title': 'Arky AI Compliance Copilot'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.1-70b-instruct',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: question }
            ],
            max_tokens: 800
          })
        });

        const data = await response.json();
        const rawAnswer = data.choices?.[0]?.message?.content;
        if (rawAnswer) {
          return {
            answer: rawAnswer,
            relatedControls: relatedControls.length > 0 ? relatedControls : this.getFallbackControls(intent),
            actionItems: this.getActionItems(intent, userCtx)
          };
        }
      } catch (err) {
        console.warn('[AI Service] OpenRouter failed for copilot. Using local engine.');
      }
    }

    // Local intent-aware answer engine with DB grounding
    return this.buildLocalAnswer(intent, question, userCtx, contextString, relatedControls, hasNoData);
  }

  private static buildLocalAnswer(
    intent: CopilotIntent,
    question: string,
    userCtx: UserContext,
    contextString: string,
    relatedControls: string[],
    hasNoData: boolean
  ): { answer: string; relatedControls: string[]; actionItems: string[] } {
    const controls = relatedControls.length > 0 ? relatedControls : this.getFallbackControls(intent);

    if (hasNoData && intent !== 'Billing' && intent !== 'ProductHowTo') {
      const missingType = intent === 'SOC2' ? 'SOC 2' : intent === 'HIPAA' ? 'HIPAA' : intent === 'GDPR' ? 'GDPR' : 'compliance';
      return {
        answer: `You don't have any ${missingType} policies or controls set up yet.\n\nTo get started, go to the **Policy Generator** and generate your first ${missingType} policy. Once you have policies, I can give you specific, data-driven guidance on your compliance readiness.\n\nWould you like me to explain what your first step should be?`,
        relatedControls: controls,
        actionItems: [
          `Navigate to Policy Generator and select ${missingType}`,
          'Generate your first compliance policy',
          'Then come back here for specific guidance'
        ]
      };
    }

    switch (intent) {
      case 'SOC2': {
        const soc2Policies = userCtx.policies.filter(p => p.framework === 'SOC 2');
        const soc2Controls = userCtx.controls.filter(c => c.framework === 'SOC 2');
        const incompleteControls = soc2Controls.filter(c => c.status !== 'Complete');

        return {
          answer: `**Direct Answer:** You currently have ${soc2Policies.length} SOC 2 ${soc2Policies.length === 1 ? 'policy' : 'policies'} and ${soc2Controls.length} SOC 2 controls (${soc2Controls.length - incompleteControls.length} complete, ${incompleteControls.length} pending).\n\n**Why:** SOC 2 Type II requires documented policies covering all Trust Services Criteria plus continuous evidence of control operation. Your current state means you ${incompleteControls.length === 0 ? 'have strong coverage' : `need to address ${incompleteControls.length} incomplete controls`}.\n\n**Next Steps:**\n${incompleteControls.length > 0 ? `- Complete evidence for: ${incompleteControls.slice(0, 2).map(c => c.code).join(', ')}\n` : ''}- Ensure each control has an evidence file attached\n- Schedule a quarterly access review`,
          relatedControls: controls,
          actionItems: this.getActionItems(intent, userCtx)
        };
      }

      case 'HIPAA': {
        const hipaaPolicies = userCtx.policies.filter(p => p.framework === 'HIPAA');
        const hipaaControls = userCtx.controls.filter(c => c.framework === 'HIPAA');

        return {
          answer: `**Direct Answer:** You have ${hipaaPolicies.length} HIPAA ${hipaaPolicies.length === 1 ? 'policy' : 'policies'} and ${hipaaControls.length} HIPAA controls in your system.\n\n**Why:** HIPAA Security Rule (45 CFR § 164.312) requires both Administrative and Technical safeguards. Key requirements include: signed BAAs with all sub-processors (Supabase, Clerk, AWS), AES-256 encryption at rest, and TLS 1.3 in transit.\n\n**Next Steps:**\n- Verify a signed BAA exists with each infrastructure vendor\n- Ensure automatic session logoff is configured (15-minute timeout)\n- Attach BAA certificate as evidence to your HIPAA controls`,
          relatedControls: controls,
          actionItems: this.getActionItems(intent, userCtx)
        };
      }

      case 'GDPR': {
        const gdprPolicies = userCtx.policies.filter(p => p.framework === 'GDPR');
        return {
          answer: `**Direct Answer:** You have ${gdprPolicies.length} GDPR ${gdprPolicies.length === 1 ? 'policy' : 'policies'} covering data protection.\n\n**Why:** GDPR Articles 15-32 require you to process personal data lawfully, respond to Subject Access Requests within 30 days, and implement appropriate technical security measures (Article 32).\n\n**Next Steps:**\n- Implement a Subject Access Request (SAR) workflow in your app\n- Conduct a Data Protection Impact Assessment (DPIA) for high-risk features\n- Verify data minimization: only collect what is strictly necessary`,
          relatedControls: controls,
          actionItems: this.getActionItems(intent, userCtx)
        };
      }

      case 'Billing':
        return {
          answer: `**Arky Growth Plan: $299/month.** This includes:\n- Unlimited compliance policy generation (SOC 2, HIPAA, GDPR)\n- Evidence management with Supabase Storage\n- AI Copilot with your data context\n- 1-click Auditor PDF export\n- Full audit trail\n\nTo upgrade, go to **Settings → Billing & Plans** and click "Upgrade to Growth".`,
          relatedControls: [],
          actionItems: ['Go to Settings → Billing & Plans', 'Click "Upgrade to Growth ($299/mo)"', 'Complete Stripe checkout']
        };

      case 'ProductHowTo':
        return {
          answer: `**How to use Arky (4-step journey):**\n\n1. **Step 1 – Onboarding:** Set up your company profile (industry, cloud provider, data types).\n2. **Step 2 – Policy Generator:** Generate SOC 2, HIPAA, or GDPR policies using AI.\n3. **Step 3 – Controls & Evidence:** Mark the 5 critical controls as Complete and attach evidence files.\n4. **Step 4 – Score & PDF:** Get your compliance score and export an auditor-ready PDF binder.\n\nYour Dashboard shows your current step and the next action to take.`,
          relatedControls: [],
          actionItems: ['Start with Step 1: Set up your company profile', 'Generate your first policy in Step 2', 'Attach evidence to controls in Step 3']
        };

      default:
        return {
          answer: `**Direct Answer:** For general compliance readiness, focus on 3 core pillars:\n1. **Policy Coverage** — Formally approved policies for SOC 2, HIPAA, and GDPR.\n2. **Evidence Collection** — Attach screenshots, configs, and certificates to each control.\n3. **Risk Management** — Document your annual risk assessment.\n\n${contextString.includes('None yet') ? 'Start by generating your first policy in the Policy Generator.' : `You currently have ${userCtx.policies.length} policies and ${userCtx.controls.length} controls on file.`}`,
          relatedControls: controls,
          actionItems: this.getActionItems('General', userCtx)
        };
    }
  }

  private static getFallbackControls(intent: CopilotIntent): string[] {
    switch (intent) {
      case 'SOC2': return ['CC6.1 — Logical Access Control & MFA', 'CC6.6 — Data Encryption In-Transit & At-Rest', 'CC8.1 — CI/CD Change Management'];
      case 'HIPAA': return ['164.312(a) — Unique User Identification & Access Revocation', '164.312(e) — ePHI Transmission Encryption'];
      case 'GDPR': return ['GDPR-Art32 — Technical Confidentiality & Resiliency Assessment'];
      default: return ['CC6.1 — Logical Access', 'CC6.6 — Encryption', 'GDPR-Art32 — Data Security'];
    }
  }

  private static getActionItems(intent: CopilotIntent, userCtx: UserContext): string[] {
    const incomplete = userCtx.controls.filter(c => c.status !== 'Complete').slice(0, 2);
    const base = incomplete.length > 0
      ? incomplete.map(c => `Complete and attach evidence for control ${c.code}: ${c.title}`)
      : [];

    switch (intent) {
      case 'SOC2': return [...base, 'Enable MFA enforcement in Clerk & GitHub Settings', 'Upload infrastructure encryption config to Evidence Binder'];
      case 'HIPAA': return [...base, 'Request signed BAA from database and identity providers', 'Verify TLS 1.3 encryption certificates on external endpoints'];
      case 'GDPR': return [...base, 'Implement Subject Access Request workflow', 'Run annual DPIA for high-risk processing activities'];
      default: return [...base, 'Run the AI Policy Generator to complete missing policies', 'Export your Auditor-Ready PDF package from the Checklist page'];
    }
  }
}
