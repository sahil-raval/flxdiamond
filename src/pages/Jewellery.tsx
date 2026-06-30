import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSanityQuery } from "@/lib/useSanityData";
import { isSanityConfigured } from "@/lib/sanity";
import { JEWELLERY_QUERY, JEWELLERY_PAGE_QUERY } from "@/lib/sanity-queries";

const collections = [
  {
    id: 1,
    title: "Signature Rings",
    description: "Exceptional central stones set in master-crafted bands.",
    image: "/jewellery-ring.png",
    items: "12 Pieces"
  },
  {
    id: 2,
    title: "Bespoke Earrings",
    description: "Perfectly matched pairs for maximum brilliance.",
    image: "/jewellery-earrings.png",
    items: "8 Pieces"
  },
  {
    id: 3,
    title: "High Jewellery Necklaces",
    description: "Statement pieces featuring rare and exceptional stones.",
    image: "/jewellery-ring.png", // placeholder
    items: "4 Pieces"
  },
  {
    id: 4,
    title: "Investment Bracelets",
    description: "Classic tennis styles elevated with D-F VVS stones.",
    image: "/jewellery-earrings.png", // placeholder
    items: "6 Pieces"
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

interface SanityCollection {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  itemCount: string;
}

export default function Jewellery() {
  const { data: sanityCollections } = useSanityQuery<SanityCollection[]>(["jewellery"], JEWELLERY_QUERY);
  const { data: jp } = useSanityQuery<{ heroHeading?: string; heroSubtext?: string }>(["jewellery-page"], JEWELLERY_PAGE_QUERY);
  const jpc = isSanityConfigured ? jp : null;

  const activeCollections = isSanityConfigured && sanityCollections && sanityCollections.length > 0
    ? sanityCollections.map((c, i) => ({
        id: i + 1,
        title: c.title,
        description: c.description,
        image: c.imageUrl || "/jewellery-ring.png",
        items: c.itemCount ?? "",
      }))
    : collections;

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-primary mb-6">{jpc?.heroHeading || "High Jewellery Collections"}</h1>
          <p className="text-muted-foreground leading-relaxed">
            {jpc?.heroSubtext || "Exclusive ready-to-wear pieces and bespoke commissions for private clients and retail partners. Crafted to exacting standards, featuring the finest GIA certified stones from our inventory."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {activeCollections.map((collection, i) => (
            <motion.div 
              key={collection.id} 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }
              }}
              className="group relative overflow-hidden bg-white border border-border"
            >
              <div className="aspect-[4/3] bg-muted/20 p-12 flex items-center justify-center relative">
                <img 
                  src={collection.image} 
                  alt={collection.title} 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 text-center bg-white">
                <h3 className="font-serif text-2xl text-primary mb-2">{collection.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{collection.description}</p>
                <div className="flex justify-between items-center text-xs uppercase tracking-wider font-medium">
                  <span className="text-muted-foreground">{collection.items}</span>
                  <Button variant="link" className="rounded-none text-primary hover:text-accent p-0 h-auto font-medium tracking-wider" data-testid={`btn-jewellery-enquire-${collection.id}`}>
                    Enquire Now →
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
