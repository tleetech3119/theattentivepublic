import { Helmet } from "react-helmet-async";

const SITE = "https://theattentivepublic.info";

interface SeoProps {
  title: string;
  description: string;
  path: string; // e.g. "/", "/voting"
  type?: "website" | "article" | "profile";
  jsonLd?: object | object[];
  noindex?: boolean;
}

export const Seo = ({ title, description, path, type = "website", jsonLd, noindex }: SeoProps) => {
  const url = `${SITE}${path}`;
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {noindex && <meta name="robots" content="noindex" />}
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
};

export default Seo;
