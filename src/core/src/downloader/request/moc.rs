use crate::app::App;
use crate::downloader::query;

use super::{Request, RequestType};
use moclib::qty::Hpx;
use moclib::deser::fits::MocType;
use crate::healpix::coverage::SMOC;
use crate::downloader::QueryId;
pub struct MOCRequest {
    pub id: QueryId,
    pub url: Url,
    pub params: al_api::moc::MOC,
    is_hips_moc: bool,

    request: Request<HEALPixCoverage>,
}

impl From<MOCRequest> for RequestType {
    fn from(request: MOCRequest) -> Self {
        RequestType::MOC(request)
    }
}
use crate::survey::Url;
use wasm_bindgen_futures::JsFuture;
use web_sys::{RequestInit, RequestMode, Response};
use wasm_bindgen::JsCast;
use moclib::deser::fits;

use moclib::moc::range::op::convert::convert_to_u64;

/// Convenient type for Space-MOCs
fn from_fits_hpx<T: Idx>(
    moc: MocType<T, Hpx<T>, Cursor<&[u8]>>
) -> SMOC {
    match moc {
        MocType::Ranges(moc) => convert_to_u64::<T, Hpx<T>, _, Hpx<u64>>(moc).into_range_moc(),
        MocType::Cells(moc) => convert_to_u64::<T, Hpx<T>, _, Hpx<u64>>(
            moc.into_cell_moc_iter().ranges()
        ).into_range_moc(),
    }
}
use crate::downloader::query::Query;
use std::io::Cursor;
use moclib::idx::Idx;
use moclib::moc::{RangeMOCIterator, CellMOCIntoIterator, CellMOCIterator};
use moclib::deser::fits::MocIdxType;
use moclib::deser::fits::MocQtyType;
use wasm_bindgen::JsValue;
use crate::healpix::coverage::HEALPixCoverage;
impl From<query::MOC> for MOCRequest {
    // Create a tile request associated to a HiPS
    fn from(query: query::MOC) -> Self {
        let id = query.id();
        let query::MOC {
            url,
            params,
            is_hips_moc,
        } = query;

        let url_clone = url.clone();

        let window = web_sys::window().unwrap();
        let request =  Request::new(async move {
            let mut opts = RequestInit::new();
            opts.method("GET");
            opts.mode(RequestMode::Cors);

            let request = web_sys::Request::new_with_str_and_init(&url_clone, &opts).unwrap();
            let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;
            // `resp_value` is a `Response` object.
            debug_assert!(resp_value.is_instance_of::<Response>());
            let resp: Response = resp_value.dyn_into()?;
            let array_buffer = JsFuture::from(resp.array_buffer()?).await?;

            let bytes = js_sys::Uint8Array::new(&array_buffer).to_vec();
            let coosys_permissive = is_hips_moc;
            let smoc = match fits::from_fits_ivoa_custom(Cursor::new(&bytes[..]), coosys_permissive).map_err(|e| JsValue::from_str(&e.to_string()))? {
                MocIdxType::U16(MocQtyType::<u16, _>::Hpx(moc)) => Ok(from_fits_hpx(moc)),
                MocIdxType::U32(MocQtyType::<u32, _>::Hpx(moc)) => Ok(from_fits_hpx(moc)),
                MocIdxType::U64(MocQtyType::<u64, _>::Hpx(moc)) => Ok(from_fits_hpx(moc)),
                _ => Err(JsValue::from_str("MOC not supported. Must be a HPX MOC"))
            }?;

            Ok(HEALPixCoverage(smoc))
        });

        Self {
            id,
            url,
            request,
            params,
            is_hips_moc,
        }
    }
}

use std::sync::{Arc, Mutex};
pub struct MOC {
    pub moc: Arc<Mutex<Option<HEALPixCoverage>>>,
    pub params: al_api::moc::MOC,
    pub url: Url,
    is_hips_moc: bool,
}

impl MOC {
    pub fn get_url(&self) -> &Url {
        &self.url
    }

    pub fn from_hips(&self) -> Option<&Url> {
        if self.is_hips_moc {
            Some(&self.url)
        } else {
            None
        }
    }
}

impl<'a> From<&'a MOCRequest> for Option<MOC> {
    fn from(request: &'a MOCRequest) -> Self {
        let MOCRequest {
            request,
            url,
            is_hips_moc,
            params,
            ..
        } = request;
        if request.is_resolved() {
            let Request::<HEALPixCoverage> {
                data, ..
            } = request;
            Some(MOC {
                // This is a clone on a Arc, it is supposed to be fast
                moc: data.clone(),
                url: url.clone(),
                is_hips_moc: *is_hips_moc,
                params: params.clone()
            })
        } else {
            None
        }
    }
}
