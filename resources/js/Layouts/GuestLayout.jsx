
import { Carousel } from "antd";
import Avatar from "antd/es/avatar/avatar";

export default function GuestLayout({ children }) {
    return (
        <div className="h-full w-full relative">
            <Carousel autoplay infinite={true} className="h-full w-full">
                <div>
                    <div className="relative h-screen">
                        <img
                            src="/images/dmo-img-1.png"
                            className="w-full h-screen object-cover"
                            alt="Slide 1"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-500 to-transparent"></div>
                    </div>
                </div>
                <div>
                    <div className="relative h-screen">
                        <img
                            src="/images/dmo-img-2.png"
                            className="w-full h-screen object-cover"
                            alt="Slide 2"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-red-500 to-transparent"></div>
                    </div>
                </div>
                <div>
                    <div className="relative h-screen">
                        <img
                            src="/images/dmo-img-3.png"
                            className="w-full h-screen object-cover"
                            alt="Slide 3"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-green-500 to-transparent"></div>
                    </div>
                </div>
                <div>
                    <div className="relative h-screen">
                        <img
                            src="/images/dmo-img-4.png"
                            className="w-full h-screen object-cover"
                            alt="Slide 4"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-500 to-transparent"></div>
                    </div>
                </div>
            </Carousel>

            {/* Centered Form */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
                    {children}
                </div>
            </div>
        </div>
    );
}
