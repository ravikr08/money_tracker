import Card from "@/shared/components/ui/Card"

type CategoryCarrProps = {
    title:string;
    count:string;
    subtext:string;
    icon:string;
}

export default function CategoryCard({title, count, subtext, icon}: CategoryCarrProps){
    return(
        <Card className="flex flex-col gap-5">
                <div className="flex gap-8 items-baseline">
                <h4 className="text-lg font-bold">{title}</h4>
                <span>{icon}</span>
                </div>
                <div>
                <h2 className="text-3xl font-bold">{count}</h2>
                </div>
                <div>
                <p className="text-gray-500">{subtext}</p>
                </div>
        </Card>
    )
}