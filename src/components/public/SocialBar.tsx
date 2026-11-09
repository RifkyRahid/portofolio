import {
  GithubLogo,
  LinkedinLogo,
  InstagramLogo,
  XLogo,
  YoutubeLogo,
  DribbbleLogo,
  Globe,
  EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";

type SocialLinkItem = {
  id: string;
  platform: string;
  url: string;
};

function getSocialIcon(platform: string) {
  const key = platform.toLowerCase();
  if (key.includes("github")) return GithubLogo;
  if (key.includes("linkedin")) return LinkedinLogo;
  if (key.includes("instagram")) return InstagramLogo;
  if (key.includes("twitter") || key === "x") return XLogo;
  if (key.includes("youtube")) return YoutubeLogo;
  if (key.includes("dribbble")) return DribbbleLogo;
  return Globe;
}

export function SocialBar({
  links,
  email,
  emailLabel,
}: {
  links: SocialLinkItem[];
  email?: string;
  emailLabel: string;
}) {
  return (
    <ul
      aria-label="Social and contact links"
      className="flex flex-wrap items-center gap-2 mt-8"
    >
      {links.map((item) => {
        const Icon = getSocialIcon(item.platform);
        return (
          <li key={item.id}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.platform}
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-sm border border-border bg-bg text-text-secondary hover:text-primary hover:border-primary hover:bg-surface active:bg-primary/10 transition-colors duration-150"
            >
              <Icon size={20} weight="regular" aria-hidden="true" />
              <span className="sr-only">{item.platform}</span>
            </a>
          </li>
        );
      })}
      {email && (
        <li>
          <a
            href={`mailto:${email}`}
            aria-label={`${emailLabel}: ${email}`}
            className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-sm border border-border bg-bg text-text-secondary hover:text-primary hover:border-primary hover:bg-surface active:bg-primary/10 text-xs font-display font-semibold tracking-wide transition-colors duration-150"
          >
            <EnvelopeSimple size={18} weight="regular" aria-hidden="true" />
            <span>{email}</span>
          </a>
        </li>
      )}
    </ul>
  );
}

