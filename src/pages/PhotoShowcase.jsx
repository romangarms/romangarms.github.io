import './PhotoShowcase.css';

function PhotoShowcase() {
  return (
    <div className="photo-showcase-page">
      <div id="body">
        <div id="sidebar">
          <h1>Photo Showcase</h1>

          <div id="sidebar-bio">
            <p>
              Here's some 360-degree spherical photos I've taken with my drone—fully interactive and viewable
              right here on the page!
            </p>
            <p>
              I've taken these with a DJI Mini 2 drone. These panoramas are captured by stitching together
              multiple images taken from the drone's camera, allowing you to explore the scene in all directions.
            </p>
            <p>
              I host the interactive panoramas on Kuula, a platform
              designed for sharing 360-degree photos. You can view them directly here or on their site.
            </p>
          </div>
        </div>

        <div id="main-content">
          <iframe
            id="kuula-iframe"
            title="360 degree spherical photos"
            allow="xr-spatial-tracking; gyroscope; accelerometer"
            allowFullScreen
            src="https://kuula.co/share/collection/79yCf?logo=1&info=1&fs=1&vr=0&zoom=1&autorotate=0.06&autop=15&autopalt=1&thumbs=1"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default PhotoShowcase;
