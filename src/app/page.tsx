import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FindSwiftCodeFormContent } from "@/components/find-swift-code-form";
import { CheckSwiftCodeFormContent } from "@/components/check-swift-code-form";
import { Info } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-background">
      <div style={{ width: '450px', height: '510px' }}>
        <Tabs defaultValue="find" className="w-full h-full">
          <Card className="w-full h-full shadow-sm flex flex-col">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="find">Find SWIFT Code</TabsTrigger>
                <TabsTrigger value="check">Check SWIFT Code</TabsTrigger>
              </TabsList>
            </CardHeader>
            <div className="flex-grow">
              <TabsContent value="find">
                <FindSwiftCodeFormContent />
              </TabsContent>
              <TabsContent value="check">
                <CheckSwiftCodeFormContent />
              </TabsContent>
            </div>
            <CardFooter>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-4 w-4" />
                <p>
                  We respect your privacy. Your bank details are neither stored
                  nor viewed by us.
                </p>
              </div>
            </CardFooter>
          </Card>
        </Tabs>
      </div>
    </main>
  );
}
