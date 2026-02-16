import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { IconStar } from "@tabler/icons-react";
import { useState, useEffect } from "react";

// const revDump = [
//   {
//     img: "../../../public/img/ryujin.jpg",
//     username: "Farhan Adi Nugraha",
//     icon: IconHome,
//     comment:
//       "Kelas ini sangat bagus untuk android pemula untuk mengembangkan kemampuannya dalam melatih membuat aplikasi dengan API dan local database",
//   },
//   {
//     img: "../../../public/img/ryujin.jpg",
//     username: "Lingga",
//     icon: IconHome,
//     comment:
//       "Kelas ini sangat bagus untuk android pemula untuk mengembangkan kemampuannya dalam melatih membuat aplikasi dengan API dan local database",
//   },
//   {
//     img: "../../../public/img/ryujin.jpg",
//     username: "Nugraha",
//     icon: IconHome,
//     comment:
//       "Kelas ini sangat bagus untuk android pemula untuk mengembangkan kemampuannya dalam melatih membuat aplikasi dengan API dan local database",
//   },
// ];

export function CardReview() {
  const [reviews, setReview] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/review")
      .then((res) => res.json())
      .then((data) => {
        setReview(data.data);
      })
      .catch((err) => console.error(err));
  });
  return (
    <div className="flex gap-8">
      {reviews.map((data) => (
        <Card className="w-80" key={data.id}>
          <CardHeader>
            <div className="flex gap-4">
              <img
                src="../../../../public/img/ryujin.jpg"
                alt=""
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <CardTitle className="text-sm">Lingga</CardTitle>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <IconStar
                      key={i}
                      size={16}
                      className={
                        i < data.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300 fill-gray-300 opacity-50"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{data.review}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
