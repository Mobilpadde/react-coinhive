import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const apiUrl = 'https://api.coinhive.com/link/create';

function Shortlink(secret, useCors, corsUrl) {
    const newCreateUrl = useCors ? (corsUrl || 'https://cors-anywhere.herokuapp.com/') + apiUrl : apiUrl;

    class Linker extends Component {
        state = {
            url: null,
        };

        componentWillMount() {
            const { origin, numHashes } = this.props;

            const form = new FormData();
            form.append('url', origin);
            form.append('secret', secret);
            form.append('hashes', numHashes);

            return fetch(newCreateUrl, { method: 'post', body: form })
                .then(res => res.json())
                .then(res => {
                    if (res.success)
                        this.setState({ url: res.url });
                })
                .catch(console.error);
        }

        render() {
            const { origin, text, showOriginIfError, useRouterLink, target } = this.props;
            const { url } = this.state;

            if (url) {
                return useRouterLink ? <Link to={url} target={target}>{text || origin}</Link> : <a href={url} target={target}>{text || origin}</a>;
            }

            return showOriginIfError ? (useRouterLink ? <Link to={origin} target={target}>{text || origin}</Link> : <a href={origin} target={target}>{text || origin}</a>) : null;
        }
    }

    Linker.propTypes = {
        origin: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        showOriginIfError: PropTypes.bool.isRequired,
        useRouterLink: PropTypes.bool.isRequired,

        numHashes: PropTypes.number,
        target: PropTypes.string,
    };

    return Linker;
}

export default Shortlink;