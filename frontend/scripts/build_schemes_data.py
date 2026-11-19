#!/usr/bin/env python3
"""
Deterministic build script for BECCI Verified Government Schemes dataset (v2 Bilingual + FAQs).

Reads the verified Government of India myScheme v2 extraction (becci_schemes_full_v2.json)
containing English + Telugu (తెలుగు) fields and 4,173 official myScheme FAQs, and merges
the 4 retained non-myScheme seed programmes (CGTMSE, VCF-BC, Telangana Rajiv Yuva Vikasam,
AP BC Corporation OBMMS) with zero duplicates.

Outputs:
  1. frontend/public/data/schemes-index.json
       Compact, sanitized bilingual index of all 364 schemes (335 BECCI-eligible +
       29 restricted records stored with showOnBecci=false so they stay hidden by default).
  2. frontend/public/data/schemes/<slug>.json
       One lightweight per-scheme detail JSON loaded on demand by /schemes/:slug,
       including full English text, Telugu (తెలుగు) translations, and official FAQs.
  3. frontend/src/data/schemesMeta.js
       Tiny static summary constants (exact counts, category list, bilingual & FAQ counts).
"""

import ast
import html
import json
import re
import shutil
import zipfile
from collections import Counter
from pathlib import Path

ZIP_V2_PATH = Path(
    "/Users/dhanushmakam/.gemini/antigravity/brain/8d05628e-b5d8-4cae-a1ca-8614d48ff15e/.user_uploaded/media_1795072159650_c2ea226a.zip"
)
REPO_FRONTEND = Path("/Users/dhanushmakam/Downloads/beccipublic/frontend")
PUBLIC_DATA_DIR = REPO_FRONTEND / "public" / "data"
PER_SCHEME_DIR = PUBLIC_DATA_DIR / "schemes"
META_JS_PATH = REPO_FRONTEND / "src" / "data" / "schemesMeta.js"

VERIFIED_DATE = "19 Nov 2026"
MYSCHEME_CREDIT = "Source: myScheme, Government of India"
TELUGU_CHAR_RE = re.compile(r"[\u0C00-\u0C7F]")

# Flagship OBC & MSME schemes surfaced first in default sort order
FEATURED_SLUGS = [
    "nbcfdc-gls",
    "pmegp",
    "pmv",
    "pmmy",
    "cgtmse",
    "nssw",
    "pm-daksh",
    "sui",
    "sisfs-fs",
    "vcf-bc",
    "mszcs",
    "klp",
    "mjpovnbcebcs",
    "rajiv-yuva-vikasam",
    "ap-obmms",
]
FEATURED_RANK = {slug: i for i, slug in enumerate(FEATURED_SLUGS)}

PM_VISHWAKARMA_TRADES = [
    "Carpenter",
    "Boat maker",
    "Armourer",
    "Blacksmith",
    "Hammer & toolkit maker",
    "Locksmith",
    "Goldsmith",
    "Potter",
    "Sculptor / stone carver",
    "Cobbler",
    "Mason",
    "Basket / mat / broom maker",
    "Doll & toy maker",
    "Barber",
    "Garland maker",
    "Washerman",
    "Tailor",
    "Fishing-net maker",
]

# 4 retained verified seed schemes explicitly noted in README as not listed in these myScheme categories
RETAINED_SEED_SCHEMES = [
    {
        "slug": "cgtmse",
        "name": "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
        "short": "CGTMSE",
        "teName": "సూక్ష్మ మరియు చిన్న సంస్థల కోసం క్రెడిట్ గ్యారెంటీ ఫండ్ ట్రస్ట్ (CGTMSE)",
        "teBrief": "కొత్త మరియు ఇప్పటికే ఉన్న సూక్ష్మ, చిన్న సంస్థలకు (MSEలు) ఎటువంటి తాకట్టు లేకుండా టర్మ్ లోన్లు మరియు వర్కింగ్ క్యాపిటల్ రుణాలు అందించడానికి బ్యాంకులు మరియు రుణ సంస్థలకు క్రెడిట్ గ్యారెంటీ కవరేజ్.",
        "level": "Central",
        "state": "All India",
        "primaryCategory": "Credit Guarantee",
        "categories": ["Credit Guarantee", "Loans & Credit"],
        "ministry": "Ministry of Micro, Small and Medium Enterprises",
        "agency": "CGTMSE & Small Industries Development Bank of India (SIDBI)",
        "benefitType": "Composite",
        "obcRelevant": False,
        "entrepreneurRelevant": True,
        "showOnBecci": True,
        "restrictedTo": "",
        "featured": True,
        "status": "",
        "brief": "Credit guarantee coverage enabling participating banks and Member Lending Institutions to extend collateral-free term loans and working capital to new and existing Micro and Small Enterprises.",
        "officialUrl": "https://www.cgtmse.in/",
        "myschemeUrl": "",
        "sourceCredit": "Source: CGTMSE, Ministry of MSME & SIDBI",
        "sourceType": "seed",
        "verifiedDate": VERIFIED_DATE,
        "tags": ["Credit Guarantee", "Collateral-Free Loan", "MSME", "Working Capital", "SIDBI"],
        "openDate": "",
        "closeDate": "",
        "details": (
            "The Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE) was jointly set up by the "
            "Ministry of Micro, Small & Medium Enterprises (MoMSME), Government of India and the Small Industries "
            "Development Bank of India (SIDBI) to strengthen institutional credit delivery to the micro and small enterprise sector.\n\n"
            "Under the Credit Guarantee Scheme (CGS), eligible new and existing micro and small enterprises can access "
            "collateral-free and third-party guarantee-free term loans and working capital facilities through approved "
            "Member Lending Institutions (MLIs), including Scheduled Commercial Banks, Regional Rural Banks, Small Finance Banks and select NBFCs."
        ),
        "benefits": (
            "- Enables collateral-free and third-party guarantee-free credit facilities (term loan and/or working capital) from participating Member Lending Institutions.\n"
            "- Covers both manufacturing and service-sector micro and small enterprises, as well as retail trade and educational/training institutions notified under the scheme.\n"
            "- Special higher guarantee coverage tiers and concessions apply for micro enterprises, women entrepreneurs, MSEs in aspirational districts and notified priority categories as per prevailing CGTMSE guidelines."
        ),
        "eligibility": (
            "1. New and existing Micro and Small Enterprises (MSEs) as defined under the MSMED Act engaged in eligible manufacturing, service or notified trading activities.\n"
            "2. Enterprise should hold valid Udyam Registration.\n"
            "3. Credit facility must be extended by an approved Member Lending Institution (MLI) without collateral security or third-party guarantee on the covered portion."
        ),
        "exclusions": (
            "- Units already categorised as NPA or ineligible under prevailing CGTMSE scheme guidelines.\n"
            "- Medium and large enterprises outside the Micro & Small Enterprise definition."
        ),
        "howToApply": (
            "1. Prepare a viable business project report and obtain Udyam Registration.\n"
            "2. Approach a participating Member Lending Institution (Bank / RRB / SFB / approved NBFC) and apply for a business term loan or working capital loan under CGTMSE coverage.\n"
            "3. The lender appraises the project viability and submits the guarantee coverage request directly on the CGTMSE portal — borrowers do not apply directly to CGTMSE."
        ),
        "documentsRequired": (
            "- Udyam Registration Certificate\n"
            "- Identity & address proof of promoters (Aadhaar, PAN)\n"
            "- Business constitution documents (Proprietorship / Partnership Deed / Certificate of Incorporation)\n"
            "- Detailed Project Report (DPR) and financial projections\n"
            "- Bank statements, KYC and GST / relevant statutory licences where applicable"
        ),
        "references": [
            {"label": "CGTMSE Official Portal", "url": "https://www.cgtmse.in/"},
            {"label": "Ministry of MSME", "url": "https://msme.gov.in/"},
        ],
        "targetBeneficiaries": ["Micro & Small Enterprises", "Entrepreneurs"],
        "faqs": [
            {
                "q": "Can an entrepreneur apply directly to CGTMSE for a loan?",
                "a": "No. CGTMSE provides guarantee cover to Member Lending Institutions (banks, RRBs, SFBs and approved NBFCs). Entrepreneurs must apply directly to a participating bank/lender for a CGTMSE-backed loan.",
                "qTe": "వ్యాపారవేత్త నేరుగా CGTMSE వద్ద రుణం కోసం దరఖాస్తు చేయవచ్చా?",
                "aTe": "",
            },
            {
                "q": "Is Udyam Registration required for CGTMSE coverage?",
                "a": "Yes, valid Udyam Registration confirming Micro or Small Enterprise status is required by participating Member Lending Institutions.",
                "qTe": "CGTMSE కవరేజ్ కోసం ఉద్యమ్ రిజిస్ట్రేషన్ అవసరమా?",
                "aTe": "",
            },
        ],
    },
    {
        "slug": "vcf-bc",
        "name": "Venture Capital Fund for Backward Classes (VCF-BC)",
        "short": "VCF-BC",
        "teName": "వెనుకబడిన తరగతుల కోసం వెంచర్ క్యాపిటల్ ఫండ్ (VCF-BC)",
        "teBrief": "వెనుకబడిన తరగతుల (OBC/BC) వ్యాపారవేత్తలు ప్రమోట్ చేసే వృద్ధి-దశ మరియు వినూత్న సంస్థలకు రాయితీ వెంచర్ క్యాపిటల్ ఆర్థిక సహాయం అందించే సామాజిక న్యాయ మంత్రిత్వ శాఖ కార్యక్రమం.",
        "level": "Central",
        "state": "All India",
        "primaryCategory": "OBC / Backward Classes",
        "categories": ["OBC / Backward Classes", "Startup & Innovation", "Loans & Credit"],
        "ministry": "Ministry of Social Justice and Empowerment",
        "agency": "IFCI Venture Capital Funds Ltd.",
        "benefitType": "Cash",
        "obcRelevant": True,
        "entrepreneurRelevant": True,
        "showOnBecci": True,
        "restrictedTo": "",
        "featured": True,
        "status": "",
        "brief": "Dedicated venture capital financing initiative of the Ministry of Social Justice & Empowerment, managed by IFCI Venture Capital Funds, supporting scalable and innovative enterprises promoted by Backward Class entrepreneurs.",
        "officialUrl": "https://www.ifciventure.com/",
        "myschemeUrl": "",
        "sourceCredit": "Source: IFCI Venture / Ministry of Social Justice & Empowerment",
        "sourceType": "seed",
        "verifiedDate": VERIFIED_DATE,
        "tags": ["OBC", "Backward Classes", "Venture Capital", "Startup", "Growth Finance"],
        "openDate": "",
        "closeDate": "",
        "details": (
            "The Venture Capital Fund for Backward Classes (VCF-BC) is a dedicated institutional finance initiative "
            "sponsored by the Ministry of Social Justice & Empowerment, Government of India and managed by IFCI Venture Capital Funds Ltd.\n\n"
            "It promotes entrepreneurship among Backward Classes by providing concessional venture capital assistance "
            "to scalable, commercially viable enterprises promoted by eligible Backward Class entrepreneurs."
        ),
        "benefits": (
            "- Concessional financial assistance structured as equity, optionally convertible debentures or subordinated/term venture debt depending on project requirements.\n"
            "- Enables Backward Class promoters of growth-stage companies and innovative startups to access long-term risk capital."
        ),
        "eligibility": (
            "1. Companies / enterprises promoted by eligible Backward Class (OBC) entrepreneurs holding majority shareholding as stipulated by fund guidelines.\n"
            "2. Project must demonstrate commercial viability, innovation or scalable growth potential.\n"
            "3. Confirm current shareholding, ticket-size, sector and eligibility norms directly on the IFCI Venture website before submitting an application."
        ),
        "exclusions": "",
        "howToApply": (
            "1. Visit the official IFCI Venture Capital Funds website (ifciventure.com) and review current VCF-BC investment guidelines and eligibility norms.\n"
            "2. Prepare an investment-ready project report, corporate filings and valid OBC/BC promoter certification.\n"
            "3. Submit the application directly through IFCI Venture's official submission channel."
        ),
        "documentsRequired": (
            "- Valid OBC / Backward Class Certificate of eligible promoter(s)\n"
            "- Company incorporation records (Certificate of Incorporation, MoA/AoA, shareholding pattern)\n"
            "- Detailed Project Report (DPR) / Business Plan and audited financials (where applicable)\n"
            "- KYC documents of promoters and directors"
        ),
        "references": [
            {"label": "IFCI Venture Official Website", "url": "https://www.ifciventure.com/"},
            {"label": "Ministry of Social Justice & Empowerment", "url": "https://socialjustice.gov.in/"},
        ],
        "targetBeneficiaries": ["OBC Entrepreneurs", "Startups", "Growth Enterprises"],
        "faqs": [
            {
                "q": "Who manages the Venture Capital Fund for Backward Classes?",
                "a": "The fund is sponsored by the Ministry of Social Justice & Empowerment and managed by IFCI Venture Capital Funds Ltd. Confirm active guidelines on ifciventure.com.",
                "qTe": "వెనుకబడిన తరగతుల వెంచర్ క్యాపిటల్ ఫండ్‌ను ఎవరు నిర్వహిస్తారు?",
                "aTe": "",
            }
        ],
    },
    {
        "slug": "rajiv-yuva-vikasam",
        "name": "Telangana Rajiv Yuva Vikasam",
        "short": "Rajiv Yuva Vikasam",
        "teName": "తెలంగాణ రాజీవ్ యువ వికాసం",
        "teBrief": "తెలంగాణలోని అర్హులైన యువత మరియు వెనుకబడిన తరగతుల (BC) అభ్యర్థుల స్వయం ఉపాధి కోసం ప్రతిపాదించబడిన రాష్ట్ర సబ్సిడీ సహాయ పథకం (అమలు కోసం వేచి ఉంది).",
        "level": "State",
        "state": "Telangana",
        "primaryCategory": "OBC / Backward Classes",
        "categories": ["OBC / Backward Classes", "Subsidies & Grants", "Loans & Credit", "Employment & Jobs"],
        "ministry": "Government of Telangana",
        "agency": "Telangana State Welfare & BC Corporations",
        "benefitType": "Cash",
        "obcRelevant": True,
        "entrepreneurRelevant": True,
        "showOnBecci": True,
        "restrictedTo": "",
        "featured": True,
        "status": "Awaiting rollout",
        "brief": "Proposed Telangana State self-employment subsidy assistance programme for eligible youth and Backward Class applicants. Reported awaiting operational rollout — monitor official Telangana Government notifications.",
        "officialUrl": "https://telanganatoday.com/one-year-on-rajiv-yuva-vikasam-scheme-yet-to-take-off-in-telangana",
        "myschemeUrl": "",
        "sourceCredit": "Source: Government of Telangana / Public Reporting",
        "sourceType": "seed",
        "verifiedDate": VERIFIED_DATE,
        "tags": ["Telangana", "Backward Classes", "Self-Employment", "Youth", "Subsidy"],
        "openDate": "",
        "closeDate": "",
        "details": (
            "Rajiv Yuva Vikasam is a proposed self-employment subsidy assistance scheme announced by the Government of Telangana "
            "to support eligible unemployed youth, including Backward Class applicants, in establishing micro-enterprises and livelihood units "
            "through the Telangana State Welfare & BC Corporations.\n\n"
            "> **Current Status Notice:** Operational rollout and final disbursement schedules have been reported pending. "
            "Prospective applicants should wait for official Telangana Government / BC Welfare Corporation operational notifications before paying any third party or relying on unofficial announcements."
        ),
        "benefits": (
            "- Proposed self-employment financial assistance and subsidy tiers aimed at helping eligible youth start small business, trade or service units in Telangana.\n"
            "- Final unit cost ceilings, subsidy percentages and sanction timelines are subject to official Government of Telangana operational orders."
        ),
        "eligibility": (
            "1. Permanent residents of Telangana belonging to notified eligible categories (including Backward Classes).\n"
            "2. Final age, annual family income and unit eligibility criteria will be governed strictly by official Telangana State BC Welfare Corporation notifications once operational rollout commences."
        ),
        "exclusions": "",
        "howToApply": (
            "Applications are accepted only when officially opened by the Government of Telangana / State BC Corporation through authorised state portals (such as TGBMMMS / official state portals). "
            "Do not submit fees or OTPs to unauthorised intermediaries."
        ),
        "documentsRequired": (
            "- Valid Telangana BC Community Certificate (issued via MeeSeva / competent state authority)\n"
            "- Income Certificate and Aadhaar Card\n"
            "- Residence proof and Bank Account details\n"
            "- Self-employment unit proposal / quotation as notified at rollout"
        ),
        "references": [
            {
                "label": "Status Report (Telangana Today)",
                "url": "https://telanganatoday.com/one-year-on-rajiv-yuva-vikasam-scheme-yet-to-take-off-in-telangana",
            }
        ],
        "targetBeneficiaries": ["Telangana Youth", "Backward Classes"],
        "faqs": [
            {
                "q": "Are disbursements currently open under Rajiv Yuva Vikasam?",
                "a": "Operational rollout has been reported pending. Monitor official Government of Telangana BC Welfare Corporation orders before applying or submitting documents anywhere.",
                "qTe": "రాజీవ్ యువ వికాసం కింద ప్రస్తుతం పంపిణీ ప్రారంభమైందా?",
                "aTe": "",
            }
        ],
    },
    {
        "slug": "ap-obmms",
        "name": "Andhra Pradesh BC Corporation Schemes (OBMMS)",
        "short": "AP BC OBMMS",
        "teName": "ఆంధ్రప్రదేశ్ బీసీ కార్పొరేషన్ పథకాలు (OBMMS)",
        "teBrief": "ఆంధ్రప్రదేశ్‌లో ఆన్‌లైన్ బెనిఫిషియరీ మేనేజ్‌మెంట్ & మానిటరింగ్ సిస్టమ్ (OBMMS) మరియు AP బీసీ కార్పొరేషన్ల ద్వారా నిర్వహించబడే వెనుకబడిన తరగతుల స్వయం ఉపాధి మరియు ఆర్థిక సహాయ పథకాలు.",
        "level": "State",
        "state": "Andhra Pradesh",
        "primaryCategory": "OBC / Backward Classes",
        "categories": ["OBC / Backward Classes", "Subsidies & Grants", "Loans & Credit"],
        "ministry": "Government of Andhra Pradesh",
        "agency": "AP Backward Classes Cooperative Finance Corporation (APBCCFC)",
        "benefitType": "Cash",
        "obcRelevant": True,
        "entrepreneurRelevant": True,
        "showOnBecci": True,
        "restrictedTo": "",
        "featured": True,
        "status": "",
        "brief": "State Backward Classes welfare, self-employment and economic support programmes in Andhra Pradesh administered through the Online Beneficiary Management & Monitoring System (OBMMS) and AP BC Corporations.",
        "officialUrl": "https://apfinance.gov.in/",
        "myschemeUrl": "",
        "sourceCredit": "Source: Government of Andhra Pradesh",
        "sourceType": "seed",
        "verifiedDate": VERIFIED_DATE,
        "tags": ["Andhra Pradesh", "Backward Classes", "OBMMS", "Self-Employment", "BC Corporation"],
        "openDate": "",
        "closeDate": "",
        "details": (
            "The Government of Andhra Pradesh administers Backward Classes economic support, self-employment and welfare programmes "
            "through the Andhra Pradesh Backward Classes Cooperative Finance Corporation (APBCCFC) and affiliated community corporations "
            "covering 138 recognised BC communities (BC-A, BC-B, BC-C, BC-D and BC-E).\n\n"
            "Beneficiary registrations, bank-linked self-employment units and subsidy monitoring are typically routed through the "
            "state's Online Beneficiary Management & Monitoring System (OBMMS) and Grama/Ward Sachivalayam channels."
        ),
        "benefits": (
            "- Bank-linked self-employment subsidy schemes, artisan and occupational support, and NBCFDC channelised concessional loans for eligible Backward Class beneficiaries in Andhra Pradesh.\n"
            "- Specific scheme windows, unit ceilings and subsidy percentages are notified periodically by the Government of Andhra Pradesh BC Welfare Department."
        ),
        "eligibility": (
            "1. Applicant must be a permanent resident of Andhra Pradesh belonging to a notified Backward Class community (BC-A, BC-B, BC-C, BC-D or BC-E).\n"
            "2. Must hold a valid Andhra Pradesh Integrated Caste/Community Certificate and meet the annual income and age thresholds notified for the active scheme window."
        ),
        "exclusions": "",
        "howToApply": (
            "1. Watch for active Andhra Pradesh BC Welfare Department / APBCCFC notifications.\n"
            "2. Apply directly via the official Andhra Pradesh OBMMS portal or authorised Grama / Ward Sachivalayam centres.\n"
            "3. Confirm scheme windows and bank-linkage guidelines directly with your District BC Welfare Office."
        ),
        "documentsRequired": (
            "- Valid Andhra Pradesh BC Community Certificate\n"
            "- Income Certificate / White Ration Card (as applicable)\n"
            "- Aadhaar Card and active Bank Account linked with Aadhaar\n"
            "- Enterprise unit quotation / project details (for self-employment schemes)"
        ),
        "references": [
            {"label": "AP Finance & Budget Portal", "url": "https://apfinance.gov.in/"},
        ],
        "targetBeneficiaries": ["Andhra Pradesh Backward Classes", "Entrepreneurs", "Artisans"],
        "faqs": [
            {
                "q": "Which BC groups in Andhra Pradesh are covered under AP BC Corporations?",
                "a": "Andhra Pradesh recognises 138 Backward Class communities across five notified groups: BC-A, BC-B, BC-C, BC-D and BC-E.",
                "qTe": "ఆంధ్రప్రదేశ్ బీసీ కార్పొరేషన్ల పరిధిలోకి ఏ బీసీ గ్రూపులు వస్తాయి?",
                "aTe": "",
            }
        ],
    },
]

BAD_URL_RE = re.compile(r"^(?:blob:|file:///|javascript:|data:)", re.IGNORECASE)
CHROME_EXT_PREFIX_RE = re.compile(
    r"chrome-exten(?:sion://[a-z0-9]+/)?(https?://)", re.IGNORECASE
)


def unescape_all(text):
    """Repeatedly unescape HTML entities (handles multi-escaped &amp;amp;... in myScheme)."""
    prev = str(text or "")
    for _ in range(50):
        nxt = html.unescape(prev)
        if nxt == prev:
            break
        prev = nxt
    return prev


def sanitize_url(raw_url):
    """Return a clean https?:// URL or '' if invalid/local/blob."""
    if not raw_url:
        return ""
    u = unescape_all(raw_url).strip()
    if not u:
        return ""
    u = CHROME_EXT_PREFIX_RE.sub(r"\1", u)
    if BAD_URL_RE.match(u) or "blob:" in u.lower() or "file:///" in u.lower() or "chrome-exten" in u.lower():
        return ""
    if not re.match(r"^https?://", u, re.IGNORECASE):
        if re.match(r"^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$", u):
            u = "https://" + u
        else:
            return ""
    if " " in u:
        u = u.replace(" ", "%20")
    return u


def slate_nodes_to_markdown(nodes, indent=0):
    """Convert Slate rich-text JSON AST (present in 3 myScheme documents_required fields) to clean Markdown."""
    lines = []
    for node in nodes:
        if not isinstance(node, dict):
            continue
        ntype = node.get("type", "")
        children = node.get("children", [])

        def inline_text(ch_list):
            parts = []
            for ch in ch_list:
                if not isinstance(ch, dict):
                    continue
                if ch.get("type") == "link" and ch.get("link"):
                    lbl = inline_text(ch.get("children", []))
                    u = sanitize_url(ch.get("link"))
                    parts.append(f"[{lbl}]({u})" if u else lbl)
                elif "text" in ch:
                    t = ch["text"]
                    if not t:
                        continue
                    if ch.get("bold") and t.strip():
                        parts.append(f"**{t.strip()}**" + (" " if t.endswith(" ") else ""))
                    else:
                        parts.append(t)
                elif "children" in ch:
                    parts.append(inline_text(ch["children"]))
            return "".join(parts).strip()

        if ntype == "block_quote":
            txt = inline_text(children)
            if txt:
                lines.append(f"> {txt}")
        elif ntype.startswith("heading"):
            txt = inline_text(children).strip("*").strip()
            if txt:
                lines.append(f"\n**{txt}**\n")
        elif ntype in ("ul_list", "bulleted_list", "ol_list", "numbered_list"):
            for idx, item in enumerate(children, 1):
                if isinstance(item, dict):
                    item_txt = inline_text(item.get("children", []))
                    if item_txt:
                        prefix = f"{idx}. " if ntype.startswith(("ol", "num")) else "- "
                        lines.append(f"{'  ' * indent}{prefix}{item_txt}")
        elif ntype == "list_item":
            txt = inline_text(children)
            if txt:
                lines.append(f"{'  ' * indent}- {txt}")
        else:
            txt = inline_text(children)
            if txt:
                lines.append(txt)
    return "\n".join(lines).strip()


def clean_markdown_text(raw, is_telugu=False):
    """Sanitize raw myScheme English or Telugu markdown/text cleanly."""
    if not raw:
        return ""
    txt = str(raw).strip()
    if not txt:
        return ""

    # Parse embedded Slate JSON in documents_required
    if txt.startswith("{") and '"children"' in txt:
        parsed = None
        try:
            parsed = json.loads(txt)
        except Exception:
            arr_start = txt.find("[")
            if arr_start != -1:
                body = txt[arr_start + 1 :]
                decoder = json.JSONDecoder()
                nodes = []
                pos = 0
                n = len(body)
                while pos < n:
                    while pos < n and body[pos] in " \t\r\n,":
                        pos += 1
                    if pos >= n or body[pos] != "{":
                        break
                    try:
                        obj, end = decoder.raw_decode(body, pos)
                        nodes.append(obj)
                        pos = end
                    except Exception:
                        break
                if nodes:
                    parsed = {"nodes": nodes}
        if isinstance(parsed, dict):
            first_val = next(iter(parsed.values()))
            if isinstance(first_val, list):
                txt = slate_nodes_to_markdown(first_val)

    txt = unescape_all(txt)
    # Remove English & machine-translated Telugu <br> tags (<బిఆర్>)
    txt = re.sub(r"<\s*(?:br\s*/?|బిఆర్\s*/?)\s*>", "\n", txt, flags=re.IGNORECASE)
    # Repair `[?]15,00,000` rupee-symbol placeholder artifacts from myScheme exports
    txt = re.sub(r"\[\?\](\s*\d)", r"₹\1", txt)

    if is_telugu:
        # Repair translator-split markdown links `[label] (https://...)` -> `[label](https://...)`
        txt = re.sub(r"\]\s+\((https?://[^)]+)\)", r"](\1)", txt)
        # Collapse translator-garbled `* * * *` / `* * *` into clean paragraph breaks
        txt = re.sub(r"(?:\*\s+){3,}\*", "\n\n", txt)
        # Convert spaced bold `* * text * *` into proper `**text**`
        txt = re.sub(r"\*\s+\*\s*([^*\n]+?)\s*\*\s+\*", lambda m: f"**{m.group(1).strip()}**", txt)
        # Strip any leftover solitary `* *` artifacts
        txt = re.sub(r"\*\s+\*", "", txt)
        # Split run-on inline numbered items `...₹ 1,00,116. 1. వికలాంగుల` -> newline before `1. `
        txt = re.sub(r"([.!?])\s+(1\.\s+)", r"\1\n\2", txt)
        # Split run-on inline Telugu bullets `సహాయం.-సరళీకృత` -> `సహాయం.\n- సరళీకృత`
        txt = re.sub(r"([.!?ః])\s*-\s*(?=[\u0C00-\u0C7FA-Za-z])", r"\1\n- ", txt)
        # Split run-on `**-` into heading + bullet
        txt = re.sub(r"\*\*\s*-\s*", "**\n- ", txt)

    # Repair chrome-extension wrapped URLs inside markdown
    txt = CHROME_EXT_PREFIX_RE.sub(r"\1", txt)

    # Clean markdown links `[label](url)` where url is blob:/file:///
    def fix_md_link(m):
        label, url = m.group(1), m.group(2)
        clean_u = sanitize_url(url)
        return f"[{label}]({clean_u})" if clean_u else label

    txt = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", fix_md_link, txt)
    txt = re.sub(r"(?:blob:https?://|file:///)[^\s\)\]]+", "", txt, flags=re.IGNORECASE)
    txt = re.sub(r"([.a-zA-Z0-9)])\s{2,}(1\.\s+\*\*)", r"\1\n\2", txt)
    txt = re.sub(r"\n{3,}", "\n\n", txt).strip()

    if not txt or txt.lower() in ("na", "n/a", "none"):
        return ""

    stripped_modes = re.sub(
        r"\[(Online|Offline|Online\s*-\s*via\s*CSC|Both)\]", "", txt, flags=re.IGNORECASE
    ).strip()
    if not stripped_modes:
        return ""

    return txt


def parse_faqs_list(raw):
    """Safely parse faqs_en / faqs_te (which may be a list or Python-literal string)."""
    if not raw:
        return []
    if isinstance(raw, list):
        return raw
    if isinstance(raw, str):
        s = raw.strip()
        if not s or s == "[]":
            return []
        try:
            res = json.loads(s)
            if isinstance(res, list):
                return res
        except Exception:
            pass
        try:
            res = ast.literal_eval(s)
            if isinstance(res, list):
                return res
        except Exception:
            return []
    return []


def merge_faqs(raw_en, raw_te):
    """Merge English & Telugu FAQs into sanitized [{q, a, qTe, aTe}] list."""
    en_list = parse_faqs_list(raw_en)
    te_list = parse_faqs_list(raw_te)
    merged = []
    seen_q = set()

    for idx, qa in enumerate(en_list):
        if not isinstance(qa, dict):
            continue
        q = clean_markdown_text(qa.get("q"))
        a = clean_markdown_text(qa.get("a"))
        if not q or not a:
            continue
        q_key = q.lower()
        if q_key in seen_q:
            continue
        seen_q.add(q_key)

        q_te = ""
        a_te = ""
        if idx < len(te_list) and isinstance(te_list[idx], dict):
            cand_q = clean_markdown_text(te_list[idx].get("q"), is_telugu=True)
            cand_a = clean_markdown_text(te_list[idx].get("a"), is_telugu=True)
            if TELUGU_CHAR_RE.search(cand_q):
                q_te = cand_q
            if TELUGU_CHAR_RE.search(cand_a):
                a_te = cand_a

        merged.append({"q": q, "a": a, "qTe": q_te, "aTe": a_te})

    return merged


def parse_references(raw_refs):
    """Parse newline-separated 'Label: URL' references into sanitized [{label, url}] objects."""
    if not raw_refs:
        return []
    out = []
    seen_urls = set()
    for line in str(raw_refs).splitlines():
        line = unescape_all(line).strip()
        if not line:
            continue
        m = re.match(r"^([^:]{1,90}?):\s*(.+)$", line)
        if m and not m.group(1).lower().startswith(("http", "blob", "file")):
            label = m.group(1).strip()
            url = sanitize_url(m.group(2).strip())
        else:
            label = "Official Reference"
            url = sanitize_url(line)
        if url and url not in seen_urls:
            seen_urls.add(url)
            out.append({"label": label, "url": url})
    return out


def infer_stages(rec, categories):
    """Deterministically infer BECCI enterprise stages for Opportunity Finder / Navigator."""
    stages = set()
    cat_set = set(categories)
    hay = f"{rec.get('scheme_name','')} {rec.get('brief','')} {rec.get('subcategories','')} {rec.get('tags','')}".lower()

    if cat_set & {
        "Skill Development & Training",
        "Education & Scholarships",
        "Artisans & Traditional Trades",
        "Employment & Jobs",
        "OBC / Backward Classes",
    } or any(
        w in hay
        for w in ["aspiring", "training", "skill", "student", "youth", "self-employment", "self employment", "artisan", "unemployed"]
    ):
        stages.add("Aspiring entrepreneur")

    if cat_set & {
        "Startup & Innovation",
        "Loans & Credit",
        "Subsidies & Grants",
        "Women Entrepreneurs",
    } or any(
        w in hay
        for w in ["new unit", "setting up", "start-up", "startup", "seed", "greenfield", "new enterprise", "entrepreneur"]
    ):
        stages.add("New entrepreneur")

    if cat_set & {
        "Loans & Credit",
        "Credit Guarantee",
        "Artisans & Traditional Trades",
        "Marketing, Export & Procurement",
        "Technology, Quality & Certification",
        "Agriculture, Dairy & Food Processing",
    } or any(
        w in hay
        for w in ["msme", "micro", "existing", "working capital", "artisan", "weaver", "dairy", "food processing"]
    ):
        stages.add("Existing micro enterprise")

    if cat_set & {
        "Technology, Quality & Certification",
        "Marketing, Export & Procurement",
        "Credit Guarantee",
        "Startup & Innovation",
    } or any(
        w in hay
        for w in ["export", "certification", "upgradation", "modernisation", "expansion", "cluster", "venture", "scale", "industrial"]
    ):
        stages.add("Growing enterprise")

    if not stages:
        stages.update(["Aspiring entrepreneur", "Existing micro enterprise"])

    ordered = [
        "Aspiring entrepreneur",
        "New entrepreneur",
        "Existing micro enterprise",
        "Growing enterprise",
    ]
    return [s for s in ordered if s in stages]


def make_complete_brief(raw_brief, details, max_chars=260):
    """Ensure scheme hero & card briefs never end abruptly mid-sentence."""
    brief = (raw_brief or "").strip()
    det = (details or "").strip()

    if brief and re.search(r"[.!?\"”)]$", brief) and len(brief) <= max_chars + 40:
        return brief

    first_para = ""
    for para in det.split("\n\n"):
        cleaned = re.sub(r"^[>#*\-\d.)\s]+", "", para).strip()
        cleaned = re.sub(r"\*\*([^*]+)\*\*", r"\1", cleaned)
        cleaned = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned)
        if len(cleaned) >= 40:
            first_para = cleaned
            break

    source = first_para or brief
    if not source:
        return ""

    sentences = re.split(r"(?<=[.!?])\s+(?=[A-Z₹0-9\"“])", source)
    out = ""
    for s in sentences:
        s = s.strip()
        if not s:
            continue
        candidate = f"{out} {s}".strip() if out else s
        if len(candidate) <= max_chars:
            out = candidate
            if len(out) >= 130:
                break
        else:
            if not out:
                out = s[: max_chars - 1].rsplit(" ", 1)[0].rstrip(",;:-") + "…"
            break
    return out or brief


def clean_telugu_brief(raw_te_brief, max_chars=240):
    """Trim Telugu brief neatly on sentence or word boundary without cutting mid-word."""
    txt = clean_markdown_text(raw_te_brief, is_telugu=True)
    if not txt:
        return ""
    txt = re.sub(r"\s+", " ", txt).strip()
    if len(txt) <= max_chars:
        if not re.search(r"[.!?।\"”)]$", txt) and len(txt) >= 180:
            # Check if there's an earlier complete sentence
            last_dot = txt.rfind(".")
            if last_dot >= 80:
                return txt[: last_dot + 1]
            return txt.rstrip(",;:-") + "…"
        return txt
    last_dot = txt[:max_chars].rfind(".")
    if last_dot >= 80:
        return txt[: last_dot + 1]
    return txt[: max_chars - 1].rsplit(" ", 1)[0].rstrip(",;:-") + "…"


def main():
    with zipfile.ZipFile(ZIP_V2_PATH) as z:
        raw_records = json.loads(z.read("becci_schemes_full_v2.json"))

    if PER_SCHEME_DIR.exists():
        shutil.rmtree(PER_SCHEME_DIR)
    PER_SCHEME_DIR.mkdir(parents=True, exist_ok=True)

    index_items = []
    seen_slugs = set()

    for rec in raw_records:
        slug = rec["slug"].strip()
        if not slug or slug in seen_slugs:
            continue
        seen_slugs.add(slug)

        categories = [c.strip() for c in (rec.get("becci_categories") or "").split(";") if c.strip()]
        primary_cat = (rec.get("primary_category") or (categories[0] if categories else "Other Support")).strip()
        if primary_cat and primary_cat not in categories:
            categories.insert(0, primary_cat)

        tags = [t.strip() for t in (rec.get("tags") or "").split(";") if t.strip()]
        target_ben = [t.strip() for t in (rec.get("target_beneficiaries") or "").split(";") if t.strip()]
        subcats = [t.strip() for t in (rec.get("subcategories") or "").split(";") if t.strip()]

        refs = parse_references(rec.get("references"))
        myscheme_url = sanitize_url(rec.get("myscheme_url")) or f"https://www.myscheme.gov.in/schemes/{slug}"

        official_url = sanitize_url(rec.get("official_link"))
        if not official_url:
            official_url = refs[0]["url"] if refs else myscheme_url

        brief_raw = clean_markdown_text(rec.get("brief"))
        details = clean_markdown_text(rec.get("details"))
        brief_full = make_complete_brief(brief_raw, details, max_chars=300)
        brief_short = make_complete_brief(brief_raw, details, max_chars=230)
        benefits = clean_markdown_text(rec.get("benefits"))
        eligibility = clean_markdown_text(rec.get("eligibility"))
        exclusions = clean_markdown_text(rec.get("exclusions"))
        how_to_apply = clean_markdown_text(rec.get("how_to_apply"))
        documents_required = clean_markdown_text(rec.get("documents_required"))

        # Telugu bilingual fields (sanitized cleanly)
        te_name = unescape_all((rec.get("te_name") or "").strip())
        if not TELUGU_CHAR_RE.search(te_name):
            te_name = ""
        te_brief = clean_telugu_brief(rec.get("te_brief"), max_chars=230)
        te_brief_full = clean_telugu_brief(rec.get("te_brief"), max_chars=320)
        te_benefits = clean_markdown_text(rec.get("te_benefits"), is_telugu=True)
        if not TELUGU_CHAR_RE.search(te_benefits):
            te_benefits = ""
        te_eligibility_raw = clean_markdown_text(rec.get("te_eligibility"), is_telugu=True)
        te_eligibility = te_eligibility_raw if TELUGU_CHAR_RE.search(te_eligibility_raw) else ""
        te_exclusions_raw = clean_markdown_text(rec.get("te_exclusions"), is_telugu=True)
        te_exclusions = te_exclusions_raw if TELUGU_CHAR_RE.search(te_exclusions_raw) else ""
        te_how_raw = clean_markdown_text(rec.get("te_how_to_apply"), is_telugu=True)
        te_how = te_how_raw if TELUGU_CHAR_RE.search(te_how_raw) else ""
        te_docs_raw = clean_markdown_text(rec.get("te_documents_required"), is_telugu=True)
        te_docs = te_docs_raw if TELUGU_CHAR_RE.search(te_docs_raw) else ""

        has_telugu = bool(te_name or te_brief or te_benefits or te_docs)

        # Official myScheme FAQs (English + Telugu Q&A)
        faqs = merge_faqs(rec.get("faqs_en"), rec.get("faqs_te"))

        show_on_becci = str(rec.get("show_on_becci") or "").strip().lower() == "yes"
        obc_relevant = str(rec.get("obc_relevant") or "").strip().lower() == "yes"
        entrepreneur_relevant = str(rec.get("entrepreneur_relevant") or "").strip().lower() == "yes"
        restricted_to = (rec.get("restricted_to") or "").strip()

        level = (rec.get("level") or "Central").strip()
        state = (rec.get("state") or "All India").strip()
        ministry = unescape_all((rec.get("ministry") or rec.get("department") or "").strip())
        agency = unescape_all((rec.get("implementing_agency") or "").strip())
        name = unescape_all((rec.get("scheme_name") or "").strip())
        short = unescape_all((rec.get("short_title") or "").strip())
        benefit_type = (rec.get("benefit_type") or "").strip()
        open_date = (rec.get("open_date") or "").strip()
        close_date = (rec.get("close_date") or "").strip()

        stages = infer_stages(rec, categories)
        featured = slug in FEATURED_RANK

        idx_entry = {
            "slug": slug,
            "name": name,
            "short": short,
            "teName": te_name,
            "teBrief": te_brief,
            "hasTelugu": has_telugu,
            "faqCount": len(faqs),
            "level": level,
            "state": state,
            "primaryCategory": primary_cat,
            "categories": categories,
            "ministry": ministry,
            "agency": agency,
            "benefitType": benefit_type,
            "obcRelevant": obc_relevant,
            "entrepreneurRelevant": entrepreneur_relevant,
            "showOnBecci": show_on_becci,
            "restrictedTo": restricted_to,
            "featured": featured,
            "status": "Closed" if close_date and close_date < "2026-11-19" else "",
            "brief": brief_short,
            "officialUrl": official_url,
            "myschemeUrl": myscheme_url,
            "sourceCredit": MYSCHEME_CREDIT,
            "sourceType": "myscheme",
            "verifiedDate": VERIFIED_DATE,
            "tags": tags[:8],
            "stages": stages,
            "openDate": open_date,
            "closeDate": close_date,
            "hasBenefits": bool(benefits),
        }
        index_items.append(idx_entry)

        detail_entry = {
            **idx_entry,
            "briefFull": brief_full,
            "details": details,
            "benefits": benefits,
            "eligibility": eligibility,
            "exclusions": exclusions,
            "howToApply": how_to_apply,
            "documentsRequired": documents_required,
            "references": refs,
            "targetBeneficiaries": target_ben,
            "subcategories": subcats,
            "trades": PM_VISHWAKARMA_TRADES if slug == "pmv" else [],
            "te": {
                "name": te_name,
                "brief": te_brief_full,
                "benefits": te_benefits,
                "eligibility": te_eligibility,
                "exclusions": te_exclusions,
                "howToApply": te_how,
                "documentsRequired": te_docs,
            },
            "faqs": faqs,
        }
        (PER_SCHEME_DIR / f"{slug}.json").write_text(
            json.dumps(detail_entry, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )

    # Merge the 4 retained non-myScheme seed schemes
    for seed in RETAINED_SEED_SCHEMES:
        slug = seed["slug"]
        assert slug not in seen_slugs, f"Duplicate slug {slug}"
        seen_slugs.add(slug)

        stages = infer_stages(
            {
                "scheme_name": seed["name"],
                "brief": seed["brief"],
                "tags": "; ".join(seed["tags"]),
                "subcategories": "",
            },
            seed["categories"],
        )

        te_name = seed.get("teName", "")
        te_brief = seed.get("teBrief", "")
        faqs = seed.get("faqs", [])

        idx_entry = {
            "slug": slug,
            "name": seed["name"],
            "short": seed["short"],
            "teName": te_name,
            "teBrief": te_brief,
            "hasTelugu": bool(te_name),
            "faqCount": len(faqs),
            "level": seed["level"],
            "state": seed["state"],
            "primaryCategory": seed["primaryCategory"],
            "categories": seed["categories"],
            "ministry": seed["ministry"],
            "agency": seed["agency"],
            "benefitType": seed["benefitType"],
            "obcRelevant": seed["obcRelevant"],
            "entrepreneurRelevant": seed["entrepreneurRelevant"],
            "showOnBecci": seed["showOnBecci"],
            "restrictedTo": seed["restrictedTo"],
            "featured": seed["featured"],
            "status": seed["status"],
            "brief": seed["brief"],
            "officialUrl": seed["officialUrl"],
            "myschemeUrl": seed["myschemeUrl"],
            "sourceCredit": seed["sourceCredit"],
            "sourceType": seed["sourceType"],
            "verifiedDate": seed["verifiedDate"],
            "tags": seed["tags"],
            "stages": stages,
            "openDate": seed["openDate"],
            "closeDate": seed["closeDate"],
            "hasBenefits": bool(seed["benefits"]),
        }
        index_items.append(idx_entry)

        detail_entry = {
            **idx_entry,
            "briefFull": seed["brief"],
            "details": seed["details"],
            "benefits": seed["benefits"],
            "eligibility": seed["eligibility"],
            "exclusions": seed["exclusions"],
            "howToApply": seed["howToApply"],
            "documentsRequired": seed["documentsRequired"],
            "references": seed["references"],
            "targetBeneficiaries": seed["targetBeneficiaries"],
            "subcategories": [],
            "trades": [],
            "te": {
                "name": te_name,
                "brief": te_brief,
                "benefits": "",
                "eligibility": "",
                "exclusions": "",
                "howToApply": "",
                "documentsRequired": "",
            },
            "faqs": faqs,
        }
        (PER_SCHEME_DIR / f"{slug}.json").write_text(
            json.dumps(detail_entry, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )

    def sort_key(item):
        if not item["showOnBecci"]:
            return (4, 0, item["name"].lower())
        if item["slug"] in FEATURED_RANK:
            return (0, FEATURED_RANK[item["slug"]], item["name"].lower())
        if item["obcRelevant"]:
            return (1, 0 if item["entrepreneurRelevant"] else 1, item["name"].lower())
        if item["entrepreneurRelevant"]:
            return (2, 0 if item["state"] in ("Telangana", "Andhra Pradesh") else 1, item["name"].lower())
        return (3, 0, item["name"].lower())

    index_items.sort(key=sort_key)

    index_path = PUBLIC_DATA_DIR / "schemes-index.json"
    index_path.write_text(
        json.dumps(index_items, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    shown = [x for x in index_items if x["showOnBecci"]]
    restricted = [x for x in index_items if not x["showOnBecci"]]
    cat_counts = Counter()
    for item in shown:
        for c in item["categories"]:
            cat_counts[c] += 1

    ordered_categories = [
        "OBC / Backward Classes",
        "Loans & Credit",
        "Subsidies & Grants",
        "Startup & Innovation",
        "Skill Development & Training",
        "Artisans & Traditional Trades",
        "Technology, Quality & Certification",
        "Marketing, Export & Procurement",
        "Agriculture, Dairy & Food Processing",
        "Women Entrepreneurs",
        "Credit Guarantee",
        "Employment & Jobs",
        "Education & Scholarships",
        "Insurance & Social Security",
        "Other Support",
    ]
    categories_meta = [
        {"name": c, "count": cat_counts.get(c, 0)}
        for c in ordered_categories
        if cat_counts.get(c, 0) > 0
    ]

    stats = {
        "totalShown": len(shown),
        "totalAll": len(index_items),
        "totalRestricted": len(restricted),
        "centralCount": sum(1 for x in shown if x["level"] == "Central"),
        "stateCount": sum(1 for x in shown if x["level"] == "State"),
        "telanganaCount": sum(1 for x in shown if x["state"] == "Telangana"),
        "andhraPradeshCount": sum(1 for x in shown if x["state"] == "Andhra Pradesh"),
        "obcCount": sum(1 for x in shown if x["obcRelevant"]),
        "entrepreneurCount": sum(1 for x in shown if x["entrepreneurRelevant"]),
        "teluguCount": sum(1 for x in shown if x["hasTelugu"]),
        "totalFaqs": sum(x["faqCount"] for x in shown),
        "verifiedDate": VERIFIED_DATE,
        "sourceCredit": MYSCHEME_CREDIT,
        "myschemeCount": sum(1 for x in shown if x["sourceType"] == "myscheme"),
        "seedCount": sum(1 for x in shown if x["sourceType"] == "seed"),
    }

    meta_js = f"""// Auto-generated by scripts/build_schemes_data.py — verified myScheme v2 Bilingual + FAQs ({VERIFIED_DATE})
// Keeps main bundle lean while exposing exact counts & category metadata across the site.

export const SCHEME_DATASET_STATS = {json.dumps(stats, indent=2)};

export const BECCI_SCHEME_CATEGORIES = {json.dumps(categories_meta, indent=2)};

// Backward-compatible aliases for legacy ?category= links across the site
export const SCHEME_CATEGORY_ALIASES = {{
  "OBC/BC": "OBC / Backward Classes",
  "Finance & credit": "Loans & Credit",
  "Skill development": "Skill Development & Training",
  "Women": "Women Entrepreneurs",
  "Startup": "Startup & Innovation",
  "Manufacturing": "Technology, Quality & Certification",
  "MSME": "Loans & Credit",
}};
"""
    META_JS_PATH.write_text(meta_js, encoding="utf-8")

    # Strict verification assertions on every decoded JSON value (English + Telugu + FAQs)!
    bad_hits = []
    for p in PER_SCHEME_DIR.glob("*.json"):
        obj = json.loads(p.read_text(encoding="utf-8"))
        combined = json.dumps(obj, ensure_ascii=False)
        for bad in ["blob:https://", "file:///", "chrome-exten", "<బిఆర్>", "<br>", "<br/>", "&quot;", "&amp;", '"children":']:
            if bad in combined:
                bad_hits.append((p.name, bad))
                break

    print("V2 BILINGUAL + FAQS BUILD COMPLETE!")
    print("Stats:", json.dumps(stats, indent=2))
    print("Index JSON size:", f"{index_path.stat().st_size:,} bytes")
    print("Per-scheme JSON files:", len(list(PER_SCHEME_DIR.glob("*.json"))))
    print("Sanitization errors found:", len(bad_hits), bad_hits[:10])
    assert len(bad_hits) == 0, f"Sanitization issues remain in: {bad_hits}"


if __name__ == "__main__":
    main()
