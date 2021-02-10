import WebTorrent from 'webtorrent'

export const makeTorrentService = () => {
  const client = new WebTorrent()

  return {
    addTorrent: (link: string) => client.add(link),
  }
}
