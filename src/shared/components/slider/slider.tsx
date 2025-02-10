import { KeyWithAnyModel } from "../../../utils/model/common-model";
import "./slider.scss";
import RcSlider from "rc-slider";
import "rc-slider/assets/index.css";

const Slider = (props: KeyWithAnyModel) => {
  return (
    <>
      <div className ="rc-slider-container">
        <RcSlider
          step={props.options.step}
          min={props.options.min}
          max={props.options.max}
          marks={props.options.marks}
          dots={props.options.dots}
          value = {props.value}
          onChange={value => props.updateSliderValue(`${value}`)}
        />
      </div>
    </>
  );
};

export default Slider;

