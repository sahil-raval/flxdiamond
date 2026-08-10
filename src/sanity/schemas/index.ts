import siteSettings from "./siteSettings";
import homePage from "./homePage";
import aboutPage from "./aboutPage";
import investmentPage from "./investmentPage";
import tradePage from "./tradePage";
import contactPage from "./contactPage";
import servicesPage from "./servicesPage";
import faqPage from "./faqPage";
import jewelleryPage from "./jewelleryPage";
import journalPage from "./journalPage";
import diamond from "./diamond";
import journalArticle from "./journalArticle";
import faqCategory from "./faqCategory";
import service from "./service";
import jewelleryCollection from "./jewelleryCollection";
import conversionStone from "./conversionStone";
import seoObject from "./seoObject";

export const schemaTypes = [
  /* Shared object types */
  seoObject,
  /* Singleton pages */
  siteSettings,
  homePage,
  aboutPage,
  investmentPage,
  tradePage,
  contactPage,
  servicesPage,
  faqPage,
  jewelleryPage,
  journalPage,
  /* Collections */
  diamond,
  journalArticle,
  faqCategory,
  service,
  jewelleryCollection,
  conversionStone,
];
