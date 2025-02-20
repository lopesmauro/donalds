import { Card, CardContent } from "@/components/ui/card" 
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface consumptionMethodOptionProps {
    slug: string
    imageUrl: string
    imageAlt: string
    buttonText: string
    option: string
}

const ConsumptionMethodOption = ({imageUrl, imageAlt, buttonText, option, slug}: consumptionMethodOptionProps) => {
    return (
        <div>
            <Card>
                <CardContent className="flex flex-col items-center gap-8 py-8">
                    <div className="relative w-[80px] h-[80px]">
                        <Image src={imageUrl} alt={imageAlt} className="object-contain" fill/>
                    </div>
                    <Button variant="secondary" className="rounded-full">
                        <Link href={`${slug}/menu?method=${option}`}>{buttonText}</Link>
                    </Button>  
                </CardContent>
            </Card>
        </div>
    )
} 

export default ConsumptionMethodOption