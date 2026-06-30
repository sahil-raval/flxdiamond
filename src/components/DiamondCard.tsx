import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DiamondCardProps {
  image: string;
  shape: string;
  carat: string;
  color: string;
  clarity: string;
  cut: string;
  onRequestPrice: () => void;
}

export function DiamondCard({ image, shape, carat, color, clarity, cut, onRequestPrice }: DiamondCardProps) {
  return (
    <Card className="rounded-none border-border overflow-hidden hover:shadow-lg transition-shadow duration-300 group bg-white">
      <CardHeader className="p-0 relative aspect-square bg-muted/20">
        <img 
          src={image} 
          alt={`${carat} ${shape} diamond`} 
          className="w-full h-full object-cover p-8 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="rounded-none bg-background/80 backdrop-blur font-mono text-xs border-none">
            GIA Certified
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-serif text-xl text-primary">{shape}</h3>
            <p className="text-sm text-muted-foreground mt-1">{carat} Carat</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs border-t border-b border-border/50 py-3">
          <div>
            <p className="text-muted-foreground mb-1">Color</p>
            <p className="font-medium text-primary">{color}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Clarity</p>
            <p className="font-medium text-primary">{clarity}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Cut</p>
            <p className="font-medium text-primary">{cut}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={onRequestPrice}
          className="w-full rounded-none bg-primary hover:bg-primary/90 text-white font-medium tracking-wide uppercase text-xs h-12"
        >
          Request Price
        </Button>
      </CardFooter>
    </Card>
  );
}
