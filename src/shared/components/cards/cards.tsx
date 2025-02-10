import "./cards.scss";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import { useSelector } from "react-redux"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Cards = (props: KeyWithAnyModel) => {
    const stageSelector = useSelector((state: StoreModel) => state.stages.stages[0].stageInfo);
    const settings = {
        dots: true,
        className: "center",
        centerMode: true,
        infinite: false,
        centerPadding: "65px",
        slidesToShow: 1,
        speed: 500,
        arrows: false
    };
    return (
        <>
            <div className="cards">
                <Slider {...settings}>
                    {
                        stageSelector && stageSelector.products.map((_product: any, index: number) => {
                            return (
                                <>
                                    {
                                        (index + 1) % 3 === 0 &&
                                        <div className="card">
                                            <div className="card-img-3 card-img"></div>
                                            <div className="name-on-card">
                                                {props.name}
                                            </div>
                                        </div>
                                    }
                                    {
                                        (index + 1) % 3 !== 0 &&
                                        <div className="card">
                                            <div className={`card-img-${(index + 1) % 3}  card-img`}></div>
                                            <div className="name-on-card">
                                                {props.name}
                                            </div>
                                        </div>
                                    }
                                </>
                            )
                        })
                    }
                </Slider>
            </div>
        </>
    );
}
export default Cards;
